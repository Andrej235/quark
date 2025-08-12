using Quark.Models.Enums;

namespace Quark.Dtos.Request.ProspectListViewItem;

public class CreateProspectViewItemRequestDto
{
    public string Id { get; set; } = null!;
    public ProspectDataType Type { get; set; }
    public Guid TeamId { get; set; }
}
