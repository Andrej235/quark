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

        var result = await readService.Get(
            x => x.TeamId == teamId,
            cancellationToken: cancellationToken
        );
        if (result.IsFailed)
            return Result.Fail(result.Errors);

        return Result.Ok(result.Value.Select(responseMapper.Map));
    }
}
