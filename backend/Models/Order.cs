namespace FoodOrderingSystem.Models;

public class Order
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
    public List<OrderItem> Items { get; set; } = new();
    public decimal Subtotal { get; set; }
    public decimal DeliveryFee { get; set; } = 2.99m;
    public decimal Total { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Preparing, Out for Delivery, Delivered, Cancelled
    public string? CourierId { get; set; }
    public string? CourierName { get; set; }
    public string? CourierPhone { get; set; }
    public string PaymentMethod { get; set; } = "Cash on Delivery";
    public string Notes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int? EstimatedPreparationMinutes { get; set; }
    public int? EstimatedDeliveryMinutes { get; set; }
    public DateTime? EstimatedDeliveryAt { get; set; }
    public DateTime? PreparationStartedAt { get; set; }
    public DateTime? DeliveryStartedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string ConfirmationEmailStatus { get; set; } = "NotRequested";
    public int ConfirmationEmailAttempts { get; set; }
    public DateTime? ConfirmationEmailLastAttemptAt { get; set; }
    public DateTime? ConfirmationEmailSentAt { get; set; }
}

public class OrderItem
{
    public string ProductId { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal => Price * Quantity;
}

public class PlaceOrderRequest
{
    public string DeliveryAddress { get; set; } = string.Empty;
    public List<CartItem> Items { get; set; } = new();
    public string PaymentMethod { get; set; } = "Cash on Delivery";
    public string Notes { get; set; } = string.Empty;
}

public class CartItem
{
    public string ProductId { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class UpdateOrderStatusRequest
{
    public string Status { get; set; } = string.Empty;
}
