using System.ComponentModel.DataAnnotations;

namespace FoodOrderingSystem.Models;

public class OrderConversation
{
    public string OrderId { get; set; } = string.Empty;
    public List<OrderMessage> Messages { get; set; } = new();
}

public class OrderMessage
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string? ClientMessageId { get; set; }
    public string Sender { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class SendOrderMessageRequest
{
    [Required, StringLength(1000)]
    public string Text { get; set; } = string.Empty;
    [Required]
    public string ClientMessageId { get; set; } = string.Empty;
}
