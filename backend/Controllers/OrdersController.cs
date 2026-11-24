using FoodOrderingSystem.Models;
using FoodOrderingSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodOrderingSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly OrderService _orderService;

    public OrdersController(OrderService orderService) => _orderService = orderService;

    // Place a new order (authenticated users)
    [HttpPost]
    public IActionResult PlaceOrder([FromBody] PlaceOrderRequest req)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        if (string.IsNullOrWhiteSpace(req.DeliveryAddress))
            return BadRequest(new { message = "Delivery address is required." });

        var (success, message, order) = _orderService.PlaceOrder(userId, req);
        return success ? Ok(order) : BadRequest(new { message });
    }

    // Get current user's orders
    [HttpGet("my")]
    public IActionResult GetMyOrders()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        return Ok(_orderService.GetByUser(userId));
    }

    // Get single order (user can only see their own, admin sees all)
    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);

        var order = _orderService.GetById(id);
        if (order == null) return NotFound(new { message = "Order not found." });

        if (role != "admin" && order.UserId != userId)
            return Forbid();

        return Ok(order);
    }

    // Admin: get all orders
    [HttpGet]
    [Authorize(Roles = "admin")]
    public IActionResult GetAll() => Ok(_orderService.GetAll());

    [HttpPatch("{id}/courier")]
    [Authorize(Roles = "admin")]
    public IActionResult AssignCourier(string id, AssignCourierRequest req)
    {
        var (success, message, order) = _orderService.AssignCourier(id, req.CourierId);
        return success ? Ok(order) : BadRequest(new { message });
    }

    // Admin: update order status
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "admin")]
    public IActionResult UpdateStatus(string id, [FromBody] UpdateOrderStatusRequest req)
    {
        var (success, message, order) = _orderService.UpdateStatus(id, req.Status);
        return success ? Ok(order) : BadRequest(new { message });
    }
}
