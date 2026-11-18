using FoodOrderingSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodOrderingSystem.Controllers;

/// <summary>
/// Admin dashboard stats endpoint
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly OrderService _orderService;
    private readonly ProductService _productService;
    private readonly UserService _userService;

    public AdminController(OrderService orderService, ProductService productService, UserService userService)
    {
        _orderService = orderService;
        _productService = productService;
        _userService = userService;
    }

    [HttpGet("stats")]
    public IActionResult GetStats()
    {
        var orders = _orderService.GetAll();
        var products = _productService.GetAll();
        var users = _userService.GetAll();

        return Ok(new
        {
            totalOrders = orders.Count,
            pendingOrders = orders.Count(o => o.Status == "Pending"),
            preparingOrders = orders.Count(o => o.Status == "Preparing"),
            deliveredOrders = orders.Count(o => o.Status == "Delivered"),
            totalRevenue = orders.Where(o => o.Status == "Delivered").Sum(o => o.Total),
            totalProducts = products.Count,
            totalUsers = users.Count(u => u.Role == "user"),
            recentOrders = orders.Take(5)
        });
    }
}
