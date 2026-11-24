using FoodOrderingSystem.Data;
using FoodOrderingSystem.Models;

namespace FoodOrderingSystem.Services;

public class ProductService
{
    private readonly JsonDataStore<Product> _store;

    public ProductService(IWebHostEnvironment env)
    {
        var dataDir = Path.Combine(env.ContentRootPath, "Data", "json");
        _store = new JsonDataStore<Product>(dataDir, "products.json");
    }

    public List<Product> GetAll(string? category = null, string? search = null)
    {
        var products = _store.GetAll();

        if (!string.IsNullOrWhiteSpace(category) && category != "All")
            products = products.Where(p => p.Category.Equals(category, StringComparison.OrdinalIgnoreCase)).ToList();

        if (!string.IsNullOrWhiteSpace(search))
            products = products.Where(p =>
                p.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                p.Description.Contains(search, StringComparison.OrdinalIgnoreCase)).ToList();

        return products;
    }

    public Product? GetById(string id) =>
        _store.GetAll().FirstOrDefault(p => p.Id == id);

    public List<Product> GetRecommendations(Product dish, User? user)
    {
        var categories = dish.Category.ToLowerInvariant() switch
        {
            "drinks" => new[] { "Desserts", "Sides" },
            "desserts" => new[] { "Drinks" },
            _ => new[] { "Sides", "Extras", "Sauces", "Salads", "Drinks", "Desserts" }
        };

        return _store.GetAll()
            .Where(product => product.Id != dish.Id && product.IsAvailable &&
                categories.Contains(product.Category, StringComparer.OrdinalIgnoreCase))
            .Where(product => MatchesProfile(product, user))
            .GroupBy(product => product.Category, StringComparer.OrdinalIgnoreCase)
            .Select(group => group.OrderBy(product => product.Price).ThenBy(product => product.Id).First())
            .OrderBy(product => Array.FindIndex(categories, category => category.Equals(product.Category, StringComparison.OrdinalIgnoreCase)))
            .Take(4)
            .ToList();
    }

    private static bool MatchesProfile(Product product, User? user)
    {
        if (user == null) return true;
        var allergens = user.Allergens ?? new List<string>();
        var preferences = user.DietaryPreferences ?? new List<string>();
        if (allergens.Count > 0 && (product.Allergens == null || product.Allergens.Intersect(allergens).Any()))
            return false;

        var tags = product.DietaryTags ?? new List<string>();
        foreach (var preference in preferences)
        {
            var matches = preference switch
            {
                "Vegetarian" => tags.Contains("Vegetarian") || tags.Contains("Vegan"),
                "Pescatarian" => tags.Contains("Pescatarian") || tags.Contains("Vegetarian") || tags.Contains("Vegan"),
                "Gluten-free" => tags.Contains(preference) && product.Allergens != null && !product.Allergens.Contains("Gluten"),
                "Dairy-free" => tags.Contains(preference) && product.Allergens != null && !product.Allergens.Contains("Milk"),
                _ => tags.Contains(preference)
            };
            if (!matches) return false;
        }
        return true;
    }

    public Product Create(ProductRequest req)
    {
        var product = new Product
        {
            Name = req.Name,
            Description = req.Description,
            Price = req.Price,
            Category = req.Category,
            ImageUrl = req.ImageUrl,
            IsAvailable = req.IsAvailable,
            PreparationTime = req.PreparationTime,
            Allergens = req.Allergens?.Distinct().ToList(),
            DietaryTags = req.DietaryTags.Distinct().ToList()
        };

        var products = _store.GetAll();
        products.Add(product);
        _store.SaveAll(products);
        return product;
    }

    public (bool success, Product? product) Update(string id, ProductRequest req)
    {
        var products = _store.GetAll();
        var product = products.FirstOrDefault(p => p.Id == id);
        if (product == null) return (false, null);

        product.Name = req.Name;
        product.Description = req.Description;
        product.Price = req.Price;
        product.Category = req.Category;
        product.ImageUrl = req.ImageUrl;
        product.IsAvailable = req.IsAvailable;
        product.PreparationTime = req.PreparationTime;
        product.Allergens = req.Allergens?.Distinct().ToList();
        product.DietaryTags = req.DietaryTags.Distinct().ToList();

        _store.SaveAll(products);
        return (true, product);
    }

    public bool Delete(string id)
    {
        var products = _store.GetAll();
        var product = products.FirstOrDefault(p => p.Id == id);
        if (product == null) return false;

        products.Remove(product);
        _store.SaveAll(products);
        return true;
    }
}
