using System.Text.Json;

namespace FoodOrderingSystem.Data;

/// <summary>
/// Generic JSON file-based data store. Reads/writes typed lists to .json files.
/// </summary>
public class JsonDataStore<T>
{
    private readonly string _filePath;
    private readonly JsonSerializerOptions _options = new()
    {
        WriteIndented = true,
        PropertyNameCaseInsensitive = true
    };

    public JsonDataStore(string dataDirectory, string fileName)
    {
        Directory.CreateDirectory(dataDirectory);
        _filePath = Path.Combine(dataDirectory, fileName);

        // Create empty file if it doesn't exist
        if (!File.Exists(_filePath))
            File.WriteAllText(_filePath, "[]");
    }

    public List<T> GetAll()
    {
        var json = File.ReadAllText(_filePath);
        return JsonSerializer.Deserialize<List<T>>(json, _options) ?? new List<T>();
    }

    public void SaveAll(List<T> items)
    {
        var json = JsonSerializer.Serialize(items, _options);
        var temporaryPath = _filePath + "." + Guid.NewGuid().ToString("N") + ".tmp";
        try
        {
            File.WriteAllText(temporaryPath, json);
            File.Move(temporaryPath, _filePath, overwrite: true);
        }
        finally
        {
            File.Delete(temporaryPath);
        }
    }
}
