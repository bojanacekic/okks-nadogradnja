using FoodOrderingSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodOrderingSystem.Controllers;

[ApiController]
[Route("api/couriers")]
[Authorize(Roles = "admin")]
public class CouriersController : ControllerBase
{
    private readonly CourierService _courierService;
    private readonly OrderService _orderService;

    public CouriersController(CourierService courierService, OrderService orderService)
    {
        _courierService = courierService;
        _orderService = orderService;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var orders = _orderService.GetAll();
        return Ok(_courierService.GetAll().Select(courier =>
        {
            var activeOrderIds = orders.Where(order => order.CourierId == courier.Id && OrderService.IsActive(order))
                .Select(order => order.Id).ToList();
            return new
            {
                courier.Id, courier.Name, courier.Phone,
                IsAvailable = activeOrderIds.Count == 0,
                ActiveOrderId = activeOrderIds.FirstOrDefault(),
                ActiveOrderCount = activeOrderIds.Count,
                ActiveOrderIds = activeOrderIds
            };
        }));
    }
}
