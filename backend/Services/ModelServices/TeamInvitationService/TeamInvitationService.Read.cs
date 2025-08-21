using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.TeamInvitation;
using Quark.Errors;
using Quark.Models.Enums;
using Quark.Services.Read;

namespace Quark.Services.ModelServices.TeamInvitationService;

public partial class TeamInvitationService
{
    public Task<Result<IEnumerable<TeamInvitationResponseDto>>> GetPending(
        ClaimsPrincipal claim,
        CancellationToken cancellationToken
    )
    {
        var userId = userManager.GetUserId(claim);
        if (userId is null)
            return Task.FromResult(
                Result.Fail<IEnumerable<TeamInvitationResponseDto>>(new Unauthorized())
            );

        return readService.Get(
            x => new TeamInvitationResponseDto
            {
                Id = x.Id,
                ExpiresAt = x.ExpiresAt,
                InvitedBy = x.Sender.UserName!,
                Status = x.Status,
                TeamLogo = x.Team.Logo,
                TeamName = x.Team.Name,
            },
            x =>
                x.ReceiverId == userId
                && x.Status == TeamInvitationStatus.Pending
                && x.ExpiresAt > DateTime.UtcNow,
            queryBuilder: q => q.OrderByDescending(x => x.ExpiresAt),
            cancellationToken: cancellationToken
        );
    }

    public Task<Result<IEnumerable<TeamInvitationResponseDto>>> GetAll(
        ClaimsPrincipal claim,
        CancellationToken cancellationToken
    )
    {
        var userId = userManager.GetUserId(claim);
        if (userId is null)
            return Task.FromResult(
                Result.Fail<IEnumerable<TeamInvitationResponseDto>>(new Unauthorized())
            );

        return readService.Get(
            x => new TeamInvitationResponseDto
            {
                Id = x.Id,
                ExpiresAt = x.ExpiresAt,
                InvitedBy = x.Sender.UserName!,
                Status = x.Status,
                TeamLogo = x.Team.Logo,
                TeamName = x.Team.Name,
            },
            x => x.ReceiverId == userId && x.ExpiresAt > DateTime.UtcNow,
            queryBuilder: q => q.OrderByDescending(x => x.ExpiresAt),
            cancellationToken: cancellationToken
        );
    }
}
