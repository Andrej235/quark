using System.Security.Claims;
using FluentResults;
using Quark.Errors;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.ProspectViewService;

public partial class ProspectViewService
{
    public async Task<Result> Delete(Guid teamId, string ids, ClaimsPrincipal claims)
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await permissionsService.HasPermission(
            userId,
            teamId,
            TeamPermission.CanEditProspectLayout
        );
        if (!hasPermission)
            return new Forbidden("You do not have permission to edit prospect layout");

        var unwrappedIds = ids.Split(',').Where(x => !string.IsNullOrEmpty(x));
        if (!unwrappedIds.Any())
            return Result.Fail(new BadRequest("No ids provided"));

        var result = await deleteService.Delete(x =>
            unwrappedIds.Contains(x.Id) && x.TeamId == teamId
        );
        return result;
    }
}
