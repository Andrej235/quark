using System.Security.Claims;
using FluentResults;
using Quark.Errors;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.TeamService;

public partial class TeamService
{
    public async Task<Result> RemoveMember(Guid teamId, string username, ClaimsPrincipal claims)
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await permissionsService.HasPermission(
            userId,
            teamId,
            TeamPermission.CanRemoveUsers
        );
        if (!hasPermission)
            return new Forbidden("You do not have permission to remove users from this team");

        var kickResult = await memberDeleteService.Delete(x =>
            x.TeamId == teamId && x.User.UserName == username
        );

        return kickResult;
    }
}
