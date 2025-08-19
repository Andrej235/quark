using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.TeamRoles;
using Quark.Errors;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.TeamRoleService;

public partial class TeamRoleService
{
    public async Task<Result<IEnumerable<TeamRoleResponseDto>>> Get(
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
            TeamPermission.CanEditRoles
        );

        if (!hasPermission)
            return new Forbidden("You do not have permission to view roles");

        return await readService.Get(
            x => new TeamRoleResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Permissions = (int)x.Permissions,
                UserCount = x.Members.Count,
                TeamId = x.TeamId,
            },
            x => x.TeamId == teamId,
            cancellationToken: cancellationToken
        );
    }
}
