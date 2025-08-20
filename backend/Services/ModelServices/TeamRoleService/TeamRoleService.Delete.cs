using System.Security.Claims;
using FluentResults;
using Quark.Errors;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.TeamRoleService;

public partial class TeamRoleService
{
    public async Task<Result> Delete(Guid teamId, Guid roleId, ClaimsPrincipal claims)
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await permissionsService.HasPermission(
            userId,
            teamId,
            TeamPermission.CanEditRoles
        );

        if (!hasPermission)
            return new Forbidden("You do not have permission to edit roles");

        return await deleteService.Delete(x => x.Id == roleId);
    }
}
