using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.ProspectListViewItem;

namespace Quark.Services.ModelServices.ProspectViewService;

public partial class ProspectViewService
{
    public async Task<Result> Replace(
        Guid teamId,
        AddProspectViewItemsRequestDto request,
        ClaimsPrincipal claims
    )
    {
        var deleteResult = await deleteService.Delete(x => x.TeamId == teamId);
        if (deleteResult.IsFailed)
            return Result.Fail(deleteResult.Errors);

        var result = await createService.Add(request.Items.Select(createRequestMapper.Map));
        return result;
    }
}
