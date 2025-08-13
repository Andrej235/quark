using Quark.Models.Enums;

namespace Quark.Models;

public class ProspectDataField
{
    public string Id { get; set; } = null!;
    public ProspectDataType Type { get; set; }
    public string? Value { get; set; }

    public int ProspectId { get; set; }
    public Prospect Prospect { get; set; } = null!;

    public Guid TeamId { get; set; }
    public Team Team { get; set; } = null!;
}
