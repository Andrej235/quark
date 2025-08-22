using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.Team;
using Quark.Dtos.Response.TeamInvitation;

namespace Quark.Services.ModelServices.TeamInvitationService;

public interface ITeamInvitationService
{
    Task<Result<TeamResponseDto>> Accept(Guid invitationId, ClaimsPrincipal claim);
    Task<Result> Decline(Guid invitationId, ClaimsPrincipal claim);
    Task<Result> Revoke(Guid teamId, Guid invitationId, ClaimsPrincipal claim);

    Task<Result<IEnumerable<UserTeamInvitationResponseDto>>> GetAll(
        ClaimsPrincipal claim,
        CancellationToken cancellationToken
    );
    Task<Result<IEnumerable<TeamInvitationResponseDto>>> GetAllForTeam(
        Guid teamId,
        ClaimsPrincipal claim,
        CancellationToken cancellationToken
    );
}
