using System.ComponentModel.DataAnnotations;

namespace FoodOrderingSystem.Models;

public class Product
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsAvailable { get; set; } = true;
    public int PreparationTime { get; set; } = 15; // minutes
    public List<string>? Allergens { get; set; }
    public List<string> DietaryTags { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ProductRequest : IValidatableObject
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsAvailable { get; set; } = true;
    public int PreparationTime { get; set; } = 15;
    public List<string>? Allergens { get; set; }
    public List<string> DietaryTags { get; set; } = new();

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (DietaryTags == null || DietaryTags.Any(value => !DietaryOptions.Preferences.Contains(value)))
            yield return new ValidationResult("Select dietary tags from the available options.", new[] { nameof(DietaryTags) });
        if (Allergens != null && Allergens.Any(value => !DietaryOptions.Allergens.Contains(value)))
            yield return new ValidationResult("Select allergens from the available options.", new[] { nameof(Allergens) });
    }
}
