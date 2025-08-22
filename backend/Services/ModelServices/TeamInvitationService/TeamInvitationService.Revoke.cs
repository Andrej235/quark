using System.Security.Claims;
using FluentResults;
using Quark.Errors;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.TeamInvitationService;

public partial class TeamInvitationService
{
    public async Task<Result> Revoke(Guid teamId, Guid invitationId, ClaimsPrincipal claim)
    {
        var userId = userManager.GetUserId(claim);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await permissionService.HasPermission(
            userId,
            teamId,
            TeamPermission.CanInviteUsers
        );

        if (!hasPermission)
            return new Forbidden("You do not have permission to revoke this invitation");

        var invitationResult = await readSingleService.Get(
            x => new { x.Status, x.TeamId },
            x => x.Id == invitationId
        );

        if (invitationResult.IsFailed)
            return Result.Fail(invitationResult.Errors);

        if (invitationResult.Value.Status != TeamInvitationStatus.Pending)
            return Result.Fail(new BadRequest("Invitation is not pending"));

        if (invitationResult.Value.TeamId != teamId)
            return Result.Fail(new BadRequest("Invitation does not belong to this team"));

        var updateResult = await updateService.Update(
            x => x.Id == invitationId,
            x => x.SetProperty(x => x.Status, TeamInvitationStatus.Revoked)
        );

        return updateResult;
    }
}
