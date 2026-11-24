namespace FoodOrderingSystem.Models;

public class Courier
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}

public class AssignCourierRequest
{
    public string? CourierId { get; set; }
}
