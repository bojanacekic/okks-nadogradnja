using System.Globalization;
using System.Net;
using System.Net.Mail;
using System.Text;
using FoodOrderingSystem.Models;

namespace FoodOrderingSystem.Services;

public class OrderEmailWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly SmtpSettings _settings;
    private readonly ILogger<OrderEmailWorker> _logger;

    public OrderEmailWorker(IServiceScopeFactory scopeFactory, IConfiguration configuration, ILogger<OrderEmailWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _settings = configuration.GetSection("Email").Get<SmtpSettings>() ?? new SmtpSettings();
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_settings.IsConfigured)
        {
            _logger.LogWarning("SMTP credentials are missing. Confirmation emails remain queued until email is configured and the app restarts.");
            return;
        }

        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(2));
        try
        {
            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var orders = scope.ServiceProvider.GetRequiredService<OrderService>();
                    var order = orders.ClaimConfirmationEmail();
                    if (order == null) continue;
                    try
                    {
                        await SendAsync(order, stoppingToken);
                        orders.CompleteConfirmationEmail(order.Id, sent: true);
                    }
                    catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) { throw; }
                    catch (Exception exception)
                    {
                        orders.CompleteConfirmationEmail(order.Id, sent: false);
                        _logger.LogWarning(exception, "Confirmation email attempt failed for order {OrderId}.", order.Id);
                    }
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) { throw; }
                catch (Exception exception)
                {
                    _logger.LogError(exception, "Unable to process the confirmation email queue.");
                }
            }
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) { }
    }

    private async Task SendAsync(Order order, CancellationToken stoppingToken)
    {
        using var message = new MailMessage
        {
            From = new MailAddress(_settings.FromAddress, _settings.FromName),
            Subject = $"Order confirmation #{order.Id}",
            SubjectEncoding = Encoding.UTF8,
            BodyEncoding = Encoding.UTF8,
            Body = BuildBody(order)
        };
        message.To.Add(new MailAddress(order.UserEmail));
        using var client = new SmtpClient(_settings.Host, _settings.Port)
        {
            EnableSsl = _settings.EnableSsl,
            UseDefaultCredentials = false
        };
        if (!string.IsNullOrWhiteSpace(_settings.UserName))
            client.Credentials = new NetworkCredential(_settings.UserName, _settings.Password.Replace(" ", ""));

        using var timeout = CancellationTokenSource.CreateLinkedTokenSource(stoppingToken);
        timeout.CancelAfter(TimeSpan.FromSeconds(20));
        await client.SendMailAsync(message, timeout.Token);
    }

    private string BuildBody(Order order)
    {
        var currency = CultureInfo.GetCultureInfo("en-US");
        var belgradeTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Belgrade");
        var localCreatedAt = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.SpecifyKind(order.CreatedAt, DateTimeKind.Utc), belgradeTimeZone);
        var body = new StringBuilder();
        body.AppendLine($"Hello {order.UserName},");
        body.AppendLine();
        body.AppendLine($"Thank you for ordering from {_settings.FromName}. Your order has been received.");
        body.AppendLine($"Order #{order.Id}");
        body.AppendLine($"Placed {localCreatedAt:dd.MM.yyyy. HH:mm} (Belgrade time)");
        body.AppendLine();
        foreach (var item in order.Items)
            body.AppendLine($"{item.Quantity} × {item.ProductName} — {item.Subtotal.ToString("C", currency)}");
        body.AppendLine();
        body.AppendLine($"Subtotal {order.Subtotal.ToString("C", currency)}");
        body.AppendLine($"Delivery fee {order.DeliveryFee.ToString("C", currency)}");
        body.AppendLine($"Total {order.Total.ToString("C", currency)}");
        body.AppendLine($"Payment method {order.PaymentMethod}");
        body.AppendLine($"Delivery address {order.DeliveryAddress}");
        body.AppendLine();
        body.AppendLine($"Estimated preparation ~{order.EstimatedPreparationMinutes} min and delivery ~{order.EstimatedDeliveryMinutes} min.");
        body.AppendLine("Preparation begins after confirmation. Delivery time starts when the courier is dispatched.");
        body.AppendLine("Track the current status and countdown in My Orders.");
        return body.ToString();
    }
}
