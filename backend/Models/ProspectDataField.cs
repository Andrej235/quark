using Quark.Models.Enums;

namespace Quark.Models;

public class ProspectDataField
{
    public string Id { get; set; } = null!;
    public ProspectDataType Type { get; set; }
    public string? Value { get; set; }

    public Guid ProspectId { get; set; }
    public Prospect Prospect { get; set; } = null!;
}
