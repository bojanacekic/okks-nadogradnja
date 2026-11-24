using FoodOrderingSystem.Data;
using FoodOrderingSystem.Models;

namespace FoodOrderingSystem.Services;

public class CourierService
{
    private readonly JsonDataStore<Courier> _store;

    public CourierService(IWebHostEnvironment env)
    {
        _store = new JsonDataStore<Courier>(Path.Combine(env.ContentRootPath, "Data", "json"), "couriers.json");
    }

    public List<Courier> GetAll() => _store.GetAll();
}
