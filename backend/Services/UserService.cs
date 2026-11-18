using FoodOrderingSystem.Data;
using FoodOrderingSystem.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FoodOrderingSystem.Services;

public class UserService
{
    private readonly JsonDataStore<User> _store;
    private readonly IConfiguration _config;

    public UserService(IConfiguration config, IWebHostEnvironment env)
    {
        _config = config;
        var dataDir = Path.Combine(env.ContentRootPath, "Data", "json");
        _store = new JsonDataStore<User>(dataDir, "users.json");
    }

    public (bool success, string message, AuthResponse? response) Register(RegisterRequest req)
    {
        var users = _store.GetAll();

        if (users.Any(u => u.Email.Equals(req.Email, StringComparison.OrdinalIgnoreCase)))
            return (false, "Email already registered.", null);

        var user = new User
        {
            Name = req.Name,
            Email = req.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Phone = req.Phone,
            Address = req.Address,
            Role = "user"
        };

        users.Add(user);
        _store.SaveAll(users);

        return (true, "Registration successful.", BuildAuthResponse(user));
    }

    public (bool success, string message, AuthResponse? response) Login(LoginRequest req)
    {
        var users = _store.GetAll();
        var user = users.FirstOrDefault(u => u.Email.Equals(req.Email, StringComparison.OrdinalIgnoreCase));

        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return (false, "Invalid email or password.", null);

        return (true, "Login successful.", BuildAuthResponse(user));
    }

    public User? GetById(string id) =>
        _store.GetAll().FirstOrDefault(u => u.Id == id);

    public List<User> GetAll() => _store.GetAll();

    private AuthResponse BuildAuthResponse(User user)
    {
        var token = GenerateJwt(user);
        return new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role
        };
    }

    private string GenerateJwt(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _config["Jwt:Key"] ?? "supersecretkey1234567890abcdefgh"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"] ?? "FoodOrderingSystem",
            audience: _config["Jwt:Audience"] ?? "FoodOrderingSystem",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
