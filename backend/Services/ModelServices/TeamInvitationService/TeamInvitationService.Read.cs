using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.TeamInvitation;
using Quark.Errors;
using Quark.Models.Enums;
using Quark.Services.Read;

namespace Quark.Services.ModelServices.TeamInvitationService;

public partial class TeamInvitationService
{
    public Task<Result<IEnumerable<UserTeamInvitationResponseDto>>> GetAll(
        ClaimsPrincipal claim,
        CancellationToken cancellationToken
    )
    {
        var userId = userManager.GetUserId(claim);
        if (userId is null)
            return Task.FromResult(
                Result.Fail<IEnumerable<UserTeamInvitationResponseDto>>(new Unauthorized())
            );

        return readService.Get(
            x => new UserTeamInvitationResponseDto
            {
                Id = x.Id,
                CreatedAt = x.CreatedAt,
                InvitedBy = x.Sender.UserName!,
                Status = x.Status,
                TeamLogo = x.Team.Logo,
                TeamName = x.Team.Name,
            },
            x => x.ReceiverId == userId,
            queryBuilder: q => q.OrderByDescending(x => x.CreatedAt),
            cancellationToken: cancellationToken
        );
    }

    public async Task<Result<IEnumerable<TeamInvitationResponseDto>>> GetAllForTeam(
        Guid teamId,
        ClaimsPrincipal claim,
        CancellationToken cancellationToken
    )
    {
        var userId = userManager.GetUserId(claim);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await permissionService.HasPermission(
            userId,
            teamId,
            TeamPermission.CanViewUsers | TeamPermission.CanInviteUsers
        );
        if (!hasPermission)
            return new Forbidden(
                "You do not have permission to access invitations sent by this team."
            );

        return await readService.Get(
            x => new TeamInvitationResponseDto
            {
                Id = x.Id,
                CreatedAt = x.CreatedAt,
                InvitedBy = x.Sender.UserName!,
                Status = x.Status,
                UserName = x.Receiver.UserName!,
                Email = x.Receiver.Email!,
                UserProfilePicture = x.Receiver.ProfilePicture,
            },
            x => x.TeamId == teamId,
            queryBuilder: q => q.OrderByDescending(x => x.CreatedAt),
            cancellationToken: cancellationToken
        );
    }
}
