namespace FoodOrderingSystem.Models;

public class SmtpSettings
{
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; } = 587;
    public bool EnableSsl { get; set; } = true;
    public string FromAddress { get; set; } = string.Empty;
    public string FromName { get; set; } = "Zodetron Dining";
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

    public bool IsConfigured => !string.IsNullOrWhiteSpace(Host) && !string.IsNullOrWhiteSpace(FromAddress) &&
        (string.IsNullOrWhiteSpace(UserName) || !string.IsNullOrWhiteSpace(Password));
}
