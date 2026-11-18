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
            PreparationTime = req.PreparationTime
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
