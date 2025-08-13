using Quark.Models.Enums;

namespace Quark.Dtos.Response.ProspectListViewItem;

public class ProspectViewItemResponseDto
{
    public string Id { get; set; } = null!;
    public ProspectDataType Type { get; set; }
}
