using FoodOrderingSystem.Data;
using FoodOrderingSystem.Models;

namespace FoodOrderingSystem.Services;

public class CategoryService
{
    private readonly JsonDataStore<Category> _store;

    public CategoryService(IWebHostEnvironment env)
    {
        var dataDir = Path.Combine(env.ContentRootPath, "Data", "json");
        _store = new JsonDataStore<Category>(dataDir, "categories.json");
    }

    public List<Category> GetAll() =>
        _store.GetAll().OrderBy(c => c.SortOrder).ToList();

    public Category? GetById(string id) =>
        _store.GetAll().FirstOrDefault(c => c.Id == id);

    public Category Create(CategoryRequest req)
    {
        var category = new Category
        {
            Name = req.Name,
            Icon = req.Icon,
            Description = req.Description,
            SortOrder = req.SortOrder
        };

        var categories = _store.GetAll();
        categories.Add(category);
        _store.SaveAll(categories);
        return category;
    }

    public (bool success, Category? category) Update(string id, CategoryRequest req)
    {
        var categories = _store.GetAll();
        var category = categories.FirstOrDefault(c => c.Id == id);
        if (category == null) return (false, null);

        category.Name = req.Name;
        category.Icon = req.Icon;
        category.Description = req.Description;
        category.SortOrder = req.SortOrder;

        _store.SaveAll(categories);
        return (true, category);
    }

    public bool Delete(string id)
    {
        var categories = _store.GetAll();
        var category = categories.FirstOrDefault(c => c.Id == id);
        if (category == null) return false;

        categories.Remove(category);
        _store.SaveAll(categories);
        return true;
    }
}
