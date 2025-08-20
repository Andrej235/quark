using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.TeamRoles;
using Quark.Dtos.Response.TeamRoles;
using Quark.Errors;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.TeamRoleService;

public partial class TeamRoleService
{
    public async Task<Result<TeamRoleResponseDto>> Create(
        CreateTeamRoleRequestDto request,
        ClaimsPrincipal claims
    )
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await permissionsService.HasPermission(
            userId,
            request.TeamId,
            TeamPermission.CanEditRoles
        );

        if (!hasPermission)
            return new Forbidden("You do not have permission to edit roles");

        var mapped = createRequestMapper.Map(request);
        var result = await createService.Add(mapped);

        if (result.IsFailed)
            return Result.Fail(result.Errors);

        return responseMapper.Map(result.Value);
    }
}
