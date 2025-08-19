using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.TeamRoles;
using Quark.Dtos.Response.TeamRoles;

namespace Quark.Services.ModelServices.TeamRoleService;

public interface ITeamRoleService
{
    Task<Result<TeamRoleResponseDto>> Create(
        CreateTeamRoleRequestDto request,
        ClaimsPrincipal claims
    );
    Task<Result<IEnumerable<TeamRoleResponseDto>>> Get(
        Guid teamId,
        ClaimsPrincipal claims,
        CancellationToken cancellationToken
    );
    Task<Result> Update(UpdateTeamRoleRequestDto request, ClaimsPrincipal claims);
    Task<Result> Delete(Guid teamId, Guid roleId, ClaimsPrincipal claims);
}
