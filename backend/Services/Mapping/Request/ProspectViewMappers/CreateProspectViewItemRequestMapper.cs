using Quark.Dtos.Request.ProspectListViewItem;
using Quark.Models;

namespace Quark.Services.Mapping.Request.ProspectViewMappers;

public class CreateProspectViewItemRequestMapper
    : IRequestMapper<CreateProspectViewItemRequestDto, ProspectListViewItem>
{
    public ProspectListViewItem Map(CreateProspectViewItemRequestDto from) =>
        new()
        {
            Id = from.Id,
            Type = from.Type,
            TeamId = from.TeamId,
        };
}
