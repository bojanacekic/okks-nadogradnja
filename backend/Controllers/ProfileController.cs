using System.Security.Claims;
using FoodOrderingSystem.Models;
using FoodOrderingSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodOrderingSystem.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly UserService _userService;

    public ProfileController(UserService userService) => _userService = userService;

    [HttpGet]
    public IActionResult GetProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        var user = _userService.GetById(userId);
        if (user == null) return NotFound(new { message = "User not found." });

        return Ok(new
        {
            user.Name,
            user.Email,
            DietaryPreferences = user.DietaryPreferences ?? new List<string>(),
            Allergens = user.Allergens ?? new List<string>(),
            PreferenceOptions = DietaryOptions.Preferences,
            AllergenOptions = DietaryOptions.Allergens
        });
    }

    [HttpPut("preferences")]
    public IActionResult UpdatePreferences([FromBody] UpdatePreferencesRequest req)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        if (_userService.GetById(userId) == null)
            return NotFound(new { message = "User not found." });

        var (success, message) = _userService.UpdatePreferences(userId, req);
        return success ? GetProfile() : BadRequest(new { message });
    }
}
