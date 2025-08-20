using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.Team;
using Quark.Errors;
using Quark.Models;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.TeamService;

public partial class TeamService
{
    public async Task<Result> InviteUser(InviteUserRequestDto request, ClaimsPrincipal claims)
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await permissionsService.HasPermission(
            userId,
            request.TeamId,
            TeamPermission.CanInviteUsers
        );
        if (!hasPermission)
            return new Forbidden("You do not have permission to invite users");

        var invitedIdResult = await userReadSelectedService.Get(
            x => x.Id,
            x => x.Email == request.Email
        );

        if (invitedIdResult.IsFailed)
            return new NotFound("User not found");

        var createResult = await createInvitationService.Add(
            new TeamInvitation()
            {
                TeamId = request.TeamId,
                SenderId = userId,
                ReceiverId = invitedIdResult.Value,
                ExpiresAt = DateTime.UtcNow.AddDays(1),
                Status = TeamInvitationStatus.Pending,
            }
        );

        if (createResult.IsFailed)
            return Result.Fail(createResult.Errors);

        return Result.Ok();
    }
}
