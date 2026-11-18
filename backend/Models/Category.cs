namespace FoodOrderingSystem.Models;

public class Category
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty; // emoji or icon class
    public string Description { get; set; } = string.Empty;
    public int SortOrder { get; set; } = 0;
}

public class CategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int SortOrder { get; set; } = 0;
}
