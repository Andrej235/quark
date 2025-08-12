using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.ProspectListViewItem;

namespace Quark.Services.ModelServices.ProspectViewService;

public partial class ProspectViewService
{
    public async Task<Result> Create(AddProspectViewItemsRequestDto request, ClaimsPrincipal claims)
    {
        var result = await createService.Add(request.Items.Select(createRequestMapper.Map));
        return result;
    }
}
