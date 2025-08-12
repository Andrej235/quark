namespace Quark.Dtos.Request.ProspectListViewItem;

public class AddProspectViewItemsRequestDto
{
    public IEnumerable<CreateProspectViewItemRequestDto> Items { get; set; } = [];
}
