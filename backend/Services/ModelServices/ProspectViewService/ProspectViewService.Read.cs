using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.ProspectListViewItem;
using Quark.Errors;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.ProspectViewService;

public partial class ProspectViewService
{
    public async Task<Result<ProspectViewResponseDto>> Get(Guid teamId, ClaimsPrincipal claims)
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await permissionsService.HasPermission(
            userId,
            teamId,
            TeamPermission.CanViewProspects
        );
        if (!hasPermission)
            return new Forbidden("You do not have permission to view prospects");

        var result = await readService.Get(
            x => new ProspectViewItemResponseDto { Id = x.Id, Type = x.Type },
            x => x.TeamId == teamId
        );

        if (result.IsFailed)
            return Result.Fail(result.Errors);

        return new ProspectViewResponseDto() { Items = result.Value };
    }
}
