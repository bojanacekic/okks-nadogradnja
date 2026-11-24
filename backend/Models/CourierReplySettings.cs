namespace FoodOrderingSystem.Models;

public class CourierReplySettings
{
    public string DefaultResponse { get; set; } = string.Empty;
    public string? DefaultResponseCyrillic { get; set; }
    public string? DefaultResponseEnglish { get; set; }
    public List<string> EnglishLanguageKeywords { get; set; } = new();
    public List<CourierReplyRule> Rules { get; set; } = new();
}

public class CourierReplyRule
{
    public List<string> Keywords { get; set; } = new();
    public string Response { get; set; } = string.Empty;
    public string? ResponseCyrillic { get; set; }
    public string? ResponseEnglish { get; set; }
    public string? ExpiredResponse { get; set; }
    public string? ExpiredResponseCyrillic { get; set; }
    public string? ExpiredResponseEnglish { get; set; }
}
