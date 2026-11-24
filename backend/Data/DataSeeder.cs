using System.Text.Json;
using FoodOrderingSystem.Models;

namespace FoodOrderingSystem;

/// <summary>
/// Seeds initial categories, products, and admin user if JSON files are empty.
/// </summary>
public static class DataSeeder
{
    public static void Seed(string contentRoot)
    {
        var dataDir = Path.Combine(contentRoot, "Data", "json");
        Directory.CreateDirectory(dataDir);

        SeedCategories(dataDir);
        SeedProducts(dataDir);
        SeedAdminUser(dataDir);
        var courierPath = Path.Combine(dataDir, "couriers.json");
        if (!File.Exists(courierPath))
        {
            var couriers = new[]
            {
                new Courier { Id = "courier-1", Name = "Marko", Phone = "+000 000 001" },
                new Courier { Id = "courier-2", Name = "Ana", Phone = "+000 000 002" },
                new Courier { Id = "courier-3", Name = "Nikola", Phone = "+000 000 003" }
            };
            File.WriteAllText(courierPath, JsonSerializer.Serialize(couriers, new JsonSerializerOptions { WriteIndented = true }));
        }
    }

    private static void SeedCategories(string dir)
    {
        var path = Path.Combine(dir, "categories.json");
        if (!File.Exists(path) || new FileInfo(path).Length <= 2)
        {
            var categories = new List<Category>
            {
                new() { Id = "cat-1", Name = "Pizza", Icon = "🍕", Description = "Hot & fresh pizzas", SortOrder = 1 },
                new() { Id = "cat-2", Name = "Burgers", Icon = "🍔", Description = "Juicy burgers", SortOrder = 2 },
                new() { Id = "cat-3", Name = "Sushi", Icon = "🍣", Description = "Fresh sushi rolls", SortOrder = 3 },
                new() { Id = "cat-4", Name = "Pasta", Icon = "🍝", Description = "Italian pasta dishes", SortOrder = 4 },
                new() { Id = "cat-5", Name = "Salads", Icon = "🥗", Description = "Fresh & healthy salads", SortOrder = 5 },
                new() { Id = "cat-6", Name = "Drinks", Icon = "🥤", Description = "Beverages & drinks", SortOrder = 6 },
                new() { Id = "cat-7", Name = "Desserts", Icon = "🍰", Description = "Sweet treats", SortOrder = 7 },
                new() { Id = "cat-8", Name = "Sides", Icon = "🍟", Description = "Sides for your meal", SortOrder = 8 },
                new() { Id = "cat-9", Name = "Sauces", Icon = "🥣", Description = "Sauces and dips", SortOrder = 9 },
            };
            File.WriteAllText(path, JsonSerializer.Serialize(categories, new JsonSerializerOptions { WriteIndented = true }));
        }
    }

    private static void SeedProducts(string dir)
    {
        var path = Path.Combine(dir, "products.json");
        if (!File.Exists(path) || new FileInfo(path).Length <= 2)
        {
            var products = new List<Product>
            {
                // Pizza
                new() { Id = "p-1", Name = "Margherita Pizza", Description = "Classic tomato sauce, mozzarella, fresh basil", Price = 12.99m, Category = "Pizza", ImageUrl = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", Allergens = new() { "Gluten", "Milk" }, DietaryTags = new() { "Vegetarian", "Pescatarian" }, PreparationTime = 20 },
                new() { Id = "p-2", Name = "Pepperoni Pizza", Description = "Loaded with pepperoni and melted cheese", Price = 14.99m, Category = "Pizza", ImageUrl = "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400", Allergens = new() { "Gluten", "Milk" }, DietaryTags = new() {  }, PreparationTime = 20 },
                new() { Id = "p-3", Name = "BBQ Chicken Pizza", Description = "Smoky BBQ sauce, grilled chicken, red onions", Price = 15.99m, Category = "Pizza", ImageUrl = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", Allergens = new() { "Gluten", "Milk" }, DietaryTags = new() {  }, PreparationTime = 25 },
                // Burgers
                new() { Id = "p-4", Name = "Classic Cheeseburger", Description = "Beef patty, cheddar, lettuce, tomato, pickles", Price = 9.99m, Category = "Burgers", ImageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", Allergens = new() { "Gluten", "Milk" }, DietaryTags = new() {  }, PreparationTime = 15 },
                new() { Id = "p-5", Name = "Double Smash Burger", Description = "Two smashed patties, special sauce, caramelized onions", Price = 13.99m, Category = "Burgers", ImageUrl = "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400", Allergens = new() { "Gluten", "Milk", "Eggs" }, DietaryTags = new() {  }, PreparationTime = 15 },
                new() { Id = "p-6", Name = "Veggie Burger", Description = "Plant-based patty, avocado, sprouts, chipotle mayo", Price = 11.99m, Category = "Burgers", ImageUrl = "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400", Allergens = new() { "Gluten", "Eggs" }, DietaryTags = new() { "Vegetarian", "Pescatarian", "Dairy-free" }, PreparationTime = 15 },
                // Sushi
                new() { Id = "p-7", Name = "Salmon Roll (8 pcs)", Description = "Fresh salmon, cucumber, avocado, sesame seeds", Price = 13.99m, Category = "Sushi", ImageUrl = "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400", Allergens = new() { "Fish", "Sesame" }, DietaryTags = new() { "Pescatarian", "Gluten-free", "Dairy-free" }, PreparationTime = 10 },
                new() { Id = "p-8", Name = "Dragon Roll (8 pcs)", Description = "Shrimp tempura, avocado, eel sauce", Price = 16.99m, Category = "Sushi", ImageUrl = "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400", Allergens = new() { "Crustaceans", "Gluten", "Soy" }, DietaryTags = new() { "Pescatarian", "Dairy-free" }, PreparationTime = 10 },
                // Pasta
                new() { Id = "p-9", Name = "Spaghetti Carbonara", Description = "Creamy egg sauce, pancetta, parmesan, black pepper", Price = 13.99m, Category = "Pasta", ImageUrl = "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400", Allergens = new() { "Gluten", "Eggs", "Milk" }, DietaryTags = new() {  }, PreparationTime = 20 },
                new() { Id = "p-10", Name = "Penne Arrabbiata", Description = "Spicy tomato sauce, garlic, fresh chili, basil", Price = 11.99m, Category = "Pasta", ImageUrl = "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400", Allergens = new() { "Gluten" }, DietaryTags = new() { "Vegan", "Vegetarian", "Pescatarian", "Dairy-free" }, PreparationTime = 20 },
                // Salads
                new() { Id = "p-11", Name = "Caesar Salad", Description = "Romaine, croutons, parmesan, Caesar dressing", Price = 8.99m, Category = "Salads", ImageUrl = "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400", Allergens = new() { "Gluten", "Milk", "Eggs", "Fish", "Mustard" }, DietaryTags = new() { "Pescatarian" }, PreparationTime = 10 },
                new() { Id = "p-12", Name = "Greek Salad", Description = "Tomatoes, cucumber, olives, feta, oregano", Price = 9.99m, Category = "Salads", ImageUrl = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400", Allergens = new() { "Milk" }, DietaryTags = new() { "Vegetarian", "Pescatarian", "Gluten-free" }, PreparationTime = 10 },
                // Drinks
                new() { Id = "p-13", Name = "Fresh Lemonade", Description = "Freshly squeezed lemon, mint, sparkling water", Price = 3.99m, Category = "Drinks", ImageUrl = "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400", Allergens = new() {  }, DietaryTags = new() { "Vegan", "Vegetarian", "Pescatarian", "Gluten-free", "Dairy-free" }, PreparationTime = 5 },
                new() { Id = "p-14", Name = "Mango Smoothie", Description = "Fresh mango, yogurt, honey, ice", Price = 4.99m, Category = "Drinks", ImageUrl = "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400", Allergens = new() { "Milk" }, DietaryTags = new() { "Vegetarian", "Pescatarian", "Gluten-free" }, PreparationTime = 5 },
                // Desserts
                new() { Id = "p-15", Name = "Chocolate Lava Cake", Description = "Warm chocolate cake with molten center, vanilla ice cream", Price = 6.99m, Category = "Desserts", ImageUrl = "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400", Allergens = new() { "Gluten", "Milk", "Eggs" }, DietaryTags = new() { "Vegetarian", "Pescatarian" }, PreparationTime = 15 },
                new() { Id = "p-16", Name = "Tiramisu", Description = "Classic Italian dessert with espresso and mascarpone", Price = 5.99m, Category = "Desserts", ImageUrl = "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400", Allergens = new() { "Gluten", "Milk", "Eggs" }, DietaryTags = new() { "Vegetarian", "Pescatarian" }, PreparationTime = 5 },
            };
            products.AddRange(new[]
            {
                new Product { Id = "p-17", Name = "French Fries", Description = "Crispy potatoes with sea salt", Price = 3.49m, Category = "Sides", PreparationTime = 10, Allergens = new(), DietaryTags = new() { "Vegan", "Vegetarian", "Pescatarian", "Gluten-free", "Dairy-free" } },
                new Product { Id = "p-18", Name = "Garlic Yogurt Dip", Description = "Yogurt, garlic and fresh herbs", Price = 1.49m, Category = "Sauces", PreparationTime = 5, Allergens = new() { "Milk" }, DietaryTags = new() { "Vegetarian", "Pescatarian", "Gluten-free" } }
            });
            File.WriteAllText(path, JsonSerializer.Serialize(products, new JsonSerializerOptions { WriteIndented = true }));
        }
    }

    private static void SeedAdminUser(string dir)
    {
        var path = Path.Combine(dir, "users.json");
        if (!File.Exists(path) || new FileInfo(path).Length <= 2)
        {
            var admin = new User
            {
                Id = "admin-1",
                Name = "Admin",
                Email = "admin@foodorder.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = "admin",
                Phone = "555-0000",
                Address = "Admin HQ"
            };
            File.WriteAllText(path, JsonSerializer.Serialize(new List<User> { admin }, new JsonSerializerOptions { WriteIndented = true }));
        }
    }
}
