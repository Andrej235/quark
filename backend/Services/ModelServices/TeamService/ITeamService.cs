using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.Team;
using Quark.Dtos.Response.Team;

namespace Quark.Services.ModelServices.TeamService;

public interface ITeamService
{
    Task<Result<TeamResponseDto>> CreateTeam(CreateTeamRequestDto request, ClaimsPrincipal claims);

    Task<Result> InviteUser(InviteUserRequestDto request, ClaimsPrincipal claims);
    Task<Result> RemoveMember(Guid teamId, string username, ClaimsPrincipal claims);

    Task<Result> ChangeRole(
        Guid teamId,
        ChangeMemberRoleRequestDto request,
        ClaimsPrincipal claims
    );

    Task<Result> SetDefaultRole(
        Guid teamId,
        SetDefaultRoleRequestDto request,
        ClaimsPrincipal claims
    );

    Task<Result<IEnumerable<TeamMemberResponseDto>>> GetMembers(
        Guid teamId,
        ClaimsPrincipal claims,
        CancellationToken cancellationToken
    );
}
