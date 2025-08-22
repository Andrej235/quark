using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.Team;
using Quark.Errors;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.TeamService;

public partial class TeamService
{
    public async Task<Result> SetDefaultRole(
        Guid teamId,
        SetDefaultRoleRequestDto request,
        ClaimsPrincipal claims
    )
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

        return await updateService.Update(
            x => x.Id == teamId,
            x => x.SetProperty(x => x.DefaultRoleId, request.RoleId)
        );
    }
}
