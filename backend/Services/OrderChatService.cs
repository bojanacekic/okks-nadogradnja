using System.Globalization;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using FoodOrderingSystem.Data;
using FoodOrderingSystem.Models;

namespace FoodOrderingSystem.Services;

public class OrderChatService
{
    private readonly JsonDataStore<OrderConversation> _store;
    private readonly OrderService _orderService;
    private readonly string _replySettingsPath;

    public OrderChatService(IWebHostEnvironment env, OrderService orderService)
    {
        lock (OrderService.OrderLock)
            _store = new JsonDataStore<OrderConversation>(Path.Combine(env.ContentRootPath, "Data", "json"), "conversations.json");
        _orderService = orderService;
        _replySettingsPath = Path.Combine(env.ContentRootPath, "Data", "json", "courier-replies.json");
    }

    public object GetConversation(Order order, string? userId)
    {
        lock (OrderService.OrderLock)
        {
            var messages = _store.GetAll().FirstOrDefault(conversation => conversation.OrderId == order.Id)?.Messages
                ?? new List<OrderMessage>();
            var now = DateTime.UtcNow;
            return new
            {
                Messages = messages.Where(message => message.CreatedAt <= now).OrderBy(message => message.CreatedAt).ToList(),
                CanSend = order.UserId == userId && order.CourierId != null && order.Status == "Out for Delivery",
                IsReplyPending = messages.Any(message => message.CreatedAt > now),
                order.Status,
                order.CourierName
            };
        }
    }

    public (bool success, string message) Send(string orderId, string userId, SendOrderMessageRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Text) || request.Text.Length > 1000 || !Guid.TryParse(request.ClientMessageId, out var clientMessageId))
            return (false, "Enter a message of up to 1000 characters and a valid message identifier.");
        var messageId = clientMessageId.ToString();

        lock (OrderService.OrderLock)
        {
            var order = _orderService.GetById(orderId);
            if (order == null || order.UserId != userId) return (false, "Order not found.");
            var conversations = _store.GetAll();
            var conversation = conversations.FirstOrDefault(item => item.OrderId == orderId);
            if (conversation?.Messages.Any(message => message.ClientMessageId == messageId) == true)
                return (true, "Message already sent.");
            if (order.CourierId == null || order.Status != "Out for Delivery")
                return (false, "Messaging is available while your order is out for delivery with an assigned courier.");

            if (conversation == null)
            {
                conversation = new OrderConversation { OrderId = orderId };
                conversations.Add(conversation);
            }
            var now = DateTime.UtcNow;
            conversation.Messages.Add(new OrderMessage
            {
                ClientMessageId = messageId,
                Sender = "user", SenderName = order.UserName, Text = request.Text.Trim(), CreatedAt = now
            });
            conversation.Messages.Add(new OrderMessage
            {
                Sender = "courier", SenderName = order.CourierName ?? "Courier",
                Text = BuildReply(request.Text, order, now), CreatedAt = now.AddSeconds(2)
            });
            _store.SaveAll(conversations);
            return (true, "Message sent.");
        }
    }

    private string BuildReply(string text, Order order, DateTime now)
    {
        var settings = JsonSerializer.Deserialize<CourierReplySettings>(File.ReadAllText(_replySettingsPath));
        if (settings == null || string.IsNullOrWhiteSpace(settings.DefaultResponse) || settings.Rules == null ||
            settings.Rules.Any(rule => rule == null || rule.Keywords == null || rule.Keywords.Count == 0 ||
                rule.Keywords.Any(string.IsNullOrWhiteSpace) || string.IsNullOrWhiteSpace(rule.Response) ||
                (rule.Response.Contains("{minutes}") && string.IsNullOrWhiteSpace(rule.ExpiredResponse))))
            throw new InvalidDataException("Courier reply settings are incomplete.");

        var normalized = Normalize(text);
        var language = "sr-Latn";
        if (text.Any(character => character >= '\u0400' && character <= '\u04ff'))
            language = "sr-Cyrl";
        else if (Regex.Matches(normalized, @"\p{L}+").Any(word => settings.EnglishLanguageKeywords.Contains(word.Value)))
            language = "en";

        var rule = settings.Rules.FirstOrDefault(candidate => candidate.Keywords.Any(keyword => normalized.Contains(Normalize(keyword))));
        if (rule == null)
            return Localize(language, settings.DefaultResponse, settings.DefaultResponseCyrillic, settings.DefaultResponseEnglish);
        var response = Localize(language, rule.Response, rule.ResponseCyrillic, rule.ResponseEnglish);
        if (!response.Contains("{minutes}")) return response;
        if (order.EstimatedDeliveryAt is not DateTime arrival || arrival <= now)
            return Localize(language, rule.ExpiredResponse!, rule.ExpiredResponseCyrillic, rule.ExpiredResponseEnglish);

        var minutes = Math.Ceiling((arrival - now).TotalMinutes).ToString(CultureInfo.InvariantCulture);
        return response.Replace("{minutes}", minutes);
    }

    private static string Localize(string language, string latin, string? cyrillic, string? english) => language switch
    {
        "sr-Cyrl" => cyrillic ?? latin,
        "en" => english ?? latin,
        _ => latin
    };

    private static string Normalize(string text) => string.Concat(text.ToLowerInvariant().Normalize(NormalizationForm.FormD)
        .Where(character => CharUnicodeInfo.GetUnicodeCategory(character) != UnicodeCategory.NonSpacingMark));
}
