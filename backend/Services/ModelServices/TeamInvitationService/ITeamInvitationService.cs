using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.TeamInvitation;

namespace Quark.Services.ModelServices.TeamInvitationService;

public interface ITeamInvitationService
{
    Task<Result> Accept(Guid invitationId, ClaimsPrincipal claim);
    Task<Result> Decline(Guid invitationId, ClaimsPrincipal claim);

    Task<Result<IEnumerable<TeamInvitationResponseDto>>> Get(
        ClaimsPrincipal claim,
        CancellationToken cancellationToken
    );
}
