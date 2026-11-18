using FoodOrderingSystem.Models;
using FoodOrderingSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodOrderingSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly CategoryService _categoryService;

    public CategoriesController(CategoryService categoryService) => _categoryService = categoryService;

    [HttpGet]
    public IActionResult GetAll() => Ok(_categoryService.GetAll());

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var category = _categoryService.GetById(id);
        return category == null ? NotFound(new { message = "Category not found." }) : Ok(category);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public IActionResult Create([FromBody] CategoryRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { message = "Category name is required." });

        return Ok(_categoryService.Create(req));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult Update(string id, [FromBody] CategoryRequest req)
    {
        var (success, category) = _categoryService.Update(id, req);
        return success ? Ok(category) : NotFound(new { message = "Category not found." });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public IActionResult Delete(string id)
    {
        var success = _categoryService.Delete(id);
        return success ? Ok(new { message = "Category deleted." }) : NotFound(new { message = "Category not found." });
    }
}
