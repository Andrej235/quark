using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.ProspectListViewItem;

namespace Quark.Services.ModelServices.ProspectViewService;

public partial class ProspectViewService
{
    public async Task<Result<ProspectViewResponseDto>> Get(Guid teamId, ClaimsPrincipal claims)
    {
        var result = await readService.Get(
            x => new ProspectViewItemResponseDto { Id = x.Id, Type = x.Type },
            x => x.TeamId == teamId
        );

        if (result.IsFailed)
            return Result.Fail(result.Errors);

        return new ProspectViewResponseDto() { Items = result.Value };
    }
}
