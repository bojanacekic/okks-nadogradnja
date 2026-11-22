using System.ComponentModel.DataAnnotations;

namespace FoodOrderingSystem.Models;

public class UpdatePreferencesRequest
{
    [Required]
    public List<string> DietaryPreferences { get; set; } = new();
    [Required]
    public List<string> Allergens { get; set; } = new();
}

public static class DietaryOptions
{
    public static IReadOnlyList<string> Preferences { get; } = Array.AsReadOnly(new[]
    {
        "Vegetarian", "Vegan", "Pescatarian", "Gluten-free", "Dairy-free"
    });

    public static IReadOnlyList<string> Allergens { get; } = Array.AsReadOnly(new[]
    {
        "Gluten", "Milk", "Eggs", "Peanuts", "Tree nuts", "Soy",
        "Fish", "Crustaceans", "Molluscs", "Sesame", "Celery", "Mustard", "Lupin", "Sulphites"
    });
}
