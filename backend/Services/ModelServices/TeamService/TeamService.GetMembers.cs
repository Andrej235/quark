using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.Team;
using Quark.Errors;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.TeamService;

public partial class TeamService
{
    public async Task<Result<IEnumerable<TeamMemberResponseDto>>> GetMembers(
        Guid teamId,
        ClaimsPrincipal claims,
        CancellationToken cancellationToken
    )
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await permissionsService.HasPermission(
            userId,
            teamId,
            TeamPermission.CanViewUsers
        );

        if (!hasPermission)
            return new Forbidden("You do not have permission to view members");

        return await memberReadService.Get(
            x => new TeamMemberResponseDto
            {
                Email = x.User.Email!,
                FirstName = x.User.FirstName,
                LastName = x.User.LastName,
                ProfilePicture = x.User.ProfilePicture,
                Username = x.User.UserName!,
                RoleName = x.Role.Name,
                JoinedAt = x.JoinedAt,
            },
            x => x.TeamId == teamId,
            cancellationToken: cancellationToken
        );
    }
}
