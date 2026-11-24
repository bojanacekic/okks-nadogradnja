using FoodOrderingSystem.Data;
using FoodOrderingSystem.Models;

namespace FoodOrderingSystem.Services;

public class OrderService
{
    internal static readonly object OrderLock = new();
    private readonly JsonDataStore<Order> _orderStore;
    private readonly ProductService _productService;
    private readonly UserService _userService;
    private readonly CourierService _courierService;

    public OrderService(IWebHostEnvironment env, ProductService productService, UserService userService, CourierService courierService)
    {
        var dataDir = Path.Combine(env.ContentRootPath, "Data", "json");
        _orderStore = new JsonDataStore<Order>(dataDir, "orders.json");
        _productService = productService;
        _userService = userService;
        _courierService = courierService;
    }

    public (bool success, string message, Order? order) PlaceOrder(string userId, PlaceOrderRequest req)
    {
        if (req.Items == null || req.Items.Count == 0)
            return (false, "Cart is empty.", null);

        var user = _userService.GetById(userId);
        if (user == null) return (false, "User not found.", null);

        var orderItems = new List<OrderItem>();
        var preparationMinutes = 0;

        foreach (var cartItem in req.Items)
        {
            var product = _productService.GetById(cartItem.ProductId);
            if (product == null) return (false, $"Product {cartItem.ProductId} not found.", null);
            if (!product.IsAvailable) return (false, $"{product.Name} is currently unavailable.", null);
            if (cartItem.Quantity <= 0) return (false, "Quantity must be greater than zero.", null);
            if (product.PreparationTime <= 0)
                return (false, $"Preparation time for {product.Name} must be configured.", null);

            // Items are prepared in parallel, so the slowest dish determines readiness.
            preparationMinutes = Math.Max(preparationMinutes, product.PreparationTime);

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
        // Simulated travel time until delivery routing is available.
        const int deliveryMinutes = 30;
        var createdAt = DateTime.UtcNow;

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
            Notes = req.Notes,
            CreatedAt = createdAt,
            EstimatedPreparationMinutes = preparationMinutes,
            EstimatedDeliveryMinutes = deliveryMinutes,
            EstimatedDeliveryAt = null
        };

        lock (OrderLock)
        {
            var orders = _orderStore.GetAll();
            orders.Add(order);
            _orderStore.SaveAll(orders);
        }

        return (true, "Order placed successfully.", order);
    }

    public List<Order> GetAll()
    {
        lock (OrderLock)
            return _orderStore.GetAll().OrderByDescending(o => o.CreatedAt).ToList();
    }

    public List<Order> GetByUser(string userId) =>
        GetAll()
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToList();

    public Order? GetById(string id) =>
        GetAll().FirstOrDefault(o => o.Id == id);

    public static bool IsActive(Order order) => order.Status != "Delivered" && order.Status != "Cancelled";

    public (bool success, string message, Order? order) AssignCourier(string id, string? courierId)
    {
        lock (OrderLock)
        {
            var orders = _orderStore.GetAll();
            var order = orders.FirstOrDefault(o => o.Id == id);
            if (order == null) return (false, "Order not found.", null);
            if (!IsActive(order)) return (false, "Assign couriers only to active orders.", null);
            if (order.Status == "Out for Delivery" && string.IsNullOrWhiteSpace(courierId))
                return (false, "Assign a replacement courier while the order is out for delivery.", null);

            Courier? courier = null;
            if (!string.IsNullOrWhiteSpace(courierId))
            {
                courier = _courierService.GetAll().FirstOrDefault(c => c.Id == courierId);
                if (courier == null) return (false, "Courier not found.", null);
            }

            order.CourierId = courier?.Id;
            order.CourierName = courier?.Name;
            order.CourierPhone = courier?.Phone;
            order.UpdatedAt = DateTime.UtcNow;
            _orderStore.SaveAll(orders);
            return (true, "Courier assignment updated.", order);
        }
    }

    public (bool success, string message, Order? order) UpdateStatus(string id, string status)
    {
        var validStatuses = new[] { "Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled" };
        if (!validStatuses.Contains(status))
            return (false, "Invalid status.", null);

        lock (OrderLock)
        {
            var orders = _orderStore.GetAll();
            var order = orders.FirstOrDefault(o => o.Id == id);
            if (order == null) return (false, "Order not found.", null);

            if (status == "Out for Delivery" &&
                !_courierService.GetAll().Any(courier => courier.Id == order.CourierId))
                return (false, "Assign a courier before marking the order as out for delivery.", null);
            if (order.Status == status) return (true, "Status unchanged.", order);
            var now = DateTime.UtcNow;
            switch (status)
            {
                case "Pending":
                    order.PreparationStartedAt = null;
                    order.DeliveryStartedAt = null;
                    order.EstimatedDeliveryAt = null;
                    break;
                case "Preparing":
                    order.PreparationStartedAt = now;
                    order.DeliveryStartedAt = null;
                    order.EstimatedDeliveryAt = order.EstimatedPreparationMinutes.HasValue && order.EstimatedDeliveryMinutes.HasValue
                        ? now.AddMinutes(order.EstimatedPreparationMinutes.Value + order.EstimatedDeliveryMinutes.Value)
                        : null;
                    break;
                case "Out for Delivery":
                    order.DeliveryStartedAt = now;
                    order.EstimatedDeliveryAt = order.EstimatedDeliveryMinutes.HasValue
                        ? now.AddMinutes(order.EstimatedDeliveryMinutes.Value)
                        : null;
                    break;
            }
            order.Status = status;
            order.UpdatedAt = now;
            _orderStore.SaveAll(orders);

            return (true, "Status updated.", order);
        }
    }
}
