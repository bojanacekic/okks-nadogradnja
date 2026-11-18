using FoodOrderingSystem.Data;
using FoodOrderingSystem.Models;

namespace FoodOrderingSystem.Services;

public class OrderService
{
    private readonly JsonDataStore<Order> _orderStore;
    private readonly ProductService _productService;
    private readonly UserService _userService;

    public OrderService(IWebHostEnvironment env, ProductService productService, UserService userService)
    {
        var dataDir = Path.Combine(env.ContentRootPath, "Data", "json");
        _orderStore = new JsonDataStore<Order>(dataDir, "orders.json");
        _productService = productService;
        _userService = userService;
    }

    public (bool success, string message, Order? order) PlaceOrder(string userId, PlaceOrderRequest req)
    {
        if (req.Items == null || req.Items.Count == 0)
            return (false, "Cart is empty.", null);

        var user = _userService.GetById(userId);
        if (user == null) return (false, "User not found.", null);

        var orderItems = new List<OrderItem>();

        foreach (var cartItem in req.Items)
        {
            var product = _productService.GetById(cartItem.ProductId);
            if (product == null) return (false, $"Product {cartItem.ProductId} not found.", null);
            if (!product.IsAvailable) return (false, $"{product.Name} is currently unavailable.", null);

            orderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                Price = product.Price,
                Quantity = cartItem.Quantity
            });
        }

        var subtotal = orderItems.Sum(i => i.Subtotal);
        var deliveryFee = 2.99m;

        var order = new Order
        {
            UserId = userId,
            UserName = user.Name,
            UserEmail = user.Email,
            DeliveryAddress = req.DeliveryAddress,
            Items = orderItems,
            Subtotal = subtotal,
            DeliveryFee = deliveryFee,
            Total = subtotal + deliveryFee,
            Status = "Pending",
            PaymentMethod = req.PaymentMethod,
            Notes = req.Notes
        };

        var orders = _orderStore.GetAll();
        orders.Add(order);
        _orderStore.SaveAll(orders);

        return (true, "Order placed successfully.", order);
    }

    public List<Order> GetAll() =>
        _orderStore.GetAll().OrderByDescending(o => o.CreatedAt).ToList();

    public List<Order> GetByUser(string userId) =>
        _orderStore.GetAll()
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToList();

    public Order? GetById(string id) =>
        _orderStore.GetAll().FirstOrDefault(o => o.Id == id);

    public (bool success, string message, Order? order) UpdateStatus(string id, string status)
    {
        var validStatuses = new[] { "Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled" };
        if (!validStatuses.Contains(status))
            return (false, "Invalid status.", null);

        var orders = _orderStore.GetAll();
        var order = orders.FirstOrDefault(o => o.Id == id);
        if (order == null) return (false, "Order not found.", null);

        order.Status = status;
        order.UpdatedAt = DateTime.UtcNow;
        _orderStore.SaveAll(orders);

        return (true, "Status updated.", order);
    }
}
