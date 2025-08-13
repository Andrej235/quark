using System.Text.Json;

namespace Quark.Models;

public class ProspectLayout
{
    public Guid Id { get; set; }
    public JsonDocument JsonStructure { get; set; } = null!;
}
