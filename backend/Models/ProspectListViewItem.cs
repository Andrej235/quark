using Quark.Models.Enums;

namespace Quark.Models;

public class ProspectListViewItem
{
    public string Id { get; set; } = null!;
    public ProspectDataType Type { get; set; }

    public Guid TeamId { get; set; }
    public Team Team { get; set; } = null!;
}
