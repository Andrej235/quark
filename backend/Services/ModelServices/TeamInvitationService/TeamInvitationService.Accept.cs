using System.Security.Claims;
using FluentResults;
using Quark.Errors;
using Quark.Models;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.TeamInvitationService;

public partial class TeamInvitationService
{
    public async Task<Result> Accept(Guid invitationId, ClaimsPrincipal claim)
    {
        var userId = userManager.GetUserId(claim);
        if (userId is null)
            return new Unauthorized();

        var invitationResult = await readSingleService.Get(
            x => new
            {
                x.ExpiresAt,
                x.Status,
                x.TeamId,
                x.ReceiverId,
                x.Team.DefaultRoleId,
            },
            x => x.Id == invitationId
        );

        if (invitationResult.IsFailed)
            return Result.Fail(invitationResult.Errors);

        if (invitationResult.Value.Status != TeamInvitationStatus.Pending)
            return Result.Fail(new BadRequest("Invitation is not pending"));

        if (invitationResult.Value.ReceiverId != userId)
            return Result.Fail(new BadRequest("You are not the receiver of this invitation"));

        if (invitationResult.Value.ExpiresAt < DateTime.UtcNow)
            return Result.Fail(new BadRequest("Invitation has expired"));

        if (invitationResult.Value.DefaultRoleId is null)
            return Result.Fail(new BadRequest("Team has no default role"));

        var updateResult = await updateService.Update(
            x => x.Id == invitationId,
            x => x.SetProperty(x => x.Status, TeamInvitationStatus.Accepted)
        );

        if (!updateResult.IsSuccess)
            return Result.Fail(updateResult.Errors);

        var memberCreateResult = await createMemberService.Add(
            new TeamMember
            {
                UserId = userId,
                RoleId = invitationResult.Value.DefaultRoleId.Value,
                TeamId = invitationResult.Value.TeamId,
                JoinedAt = DateTime.UtcNow,
            }
        );

        if (!memberCreateResult.IsSuccess)
            return Result.Fail(memberCreateResult.Errors);

        return Result.Ok();
    }
}
