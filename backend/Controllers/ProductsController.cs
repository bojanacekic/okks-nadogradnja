using FoodOrderingSystem.Models;
using FoodOrderingSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodOrderingSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ProductService _productService;
    private readonly UserService _userService;

    public ProductsController(ProductService productService, UserService userService)
    {
        _productService = productService;
        _userService = userService;
    }

    [HttpGet("{id}/recommendations")]
    public IActionResult GetRecommendations(string id)
    {
        var dish = _productService.GetById(id);
        if (dish == null) return NotFound(new { message = "Product not found." });
        User? user = null;
        if (User.Identity?.IsAuthenticated == true)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            user = _userService.GetById(userId);
            if (user == null) return Unauthorized();
        }
        return Ok(_productService.GetRecommendations(dish, user));
    }

    // Public: anyone can browse products
    [HttpGet]
    public IActionResult GetAll([FromQuery] string? category, [FromQuery] string? search) =>
        Ok(_productService.GetAll(category, search));

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var product = _productService.GetById(id);
        return product == null ? NotFound(new { message = "Product not found." }) : Ok(product);
    }

    // Admin only
    [HttpPost]
    [Authorize(Roles = "admin")]
    public IActionResult Create([FromBody] ProductRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name) || req.Price <= 0)
            return BadRequest(new { message = "Name and valid price are required." });

        return Ok(_productService.Create(req));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult Update(string id, [FromBody] ProductRequest req)
    {
        var (success, product) = _productService.Update(id, req);
        return success ? Ok(product) : NotFound(new { message = "Product not found." });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult Delete(string id)
    {
        var success = _productService.Delete(id);
        return success ? Ok(new { message = "Product deleted." }) : NotFound(new { message = "Product not found." });
    }
}
