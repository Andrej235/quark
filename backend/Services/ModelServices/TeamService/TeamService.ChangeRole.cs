using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.Team;
using Quark.Errors;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.TeamService;

public partial class TeamService
{
    public async Task<Result> ChangeRole(
        Guid teamId,
        ChangeMemberRoleRequestDto request,
        ClaimsPrincipal claims
    )
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await permissionsService.HasPermission(
            userId,
            teamId,
            TeamPermission.CanEditUsers
        );
        if (!hasPermission)
            return new Forbidden("You do not have permission to change user roles.");

        var memberResult = await memberReadSingleService.Get(
            x => new { x.UserId, x.Team.OwnerId },
            x => x.User.UserName == request.UserName && x.TeamId == teamId
        );

        if (memberResult is null)
            return new NotFound("Member not found.");

        if (memberResult.Value.UserId == memberResult.Value.OwnerId)
            return new Forbidden("You cannot change the role of the team owner.");

        var updateResult = await memberUpdateService.Update(
            x => x.TeamId == teamId && x.UserId == memberResult.Value.UserId,
            x => x.SetProperty(m => m.RoleId, request.RoleId)
        );

        return updateResult;
    }
}
