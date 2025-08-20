using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.Team;
using Quark.Errors;
using Quark.Models;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.TeamInvitationService;

public partial class TeamInvitationService
{
    public async Task<Result<TeamResponseDto>> Accept(Guid invitationId, ClaimsPrincipal claim)
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
                x.Team.DefaultRole,
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

        if (invitationResult.Value.DefaultRole?.Id is null)
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
                RoleId = invitationResult.Value.DefaultRole.Id,
                TeamId = invitationResult.Value.TeamId,
                JoinedAt = DateTime.UtcNow,
            }
        );

        if (!memberCreateResult.IsSuccess)
            return Result.Fail(memberCreateResult.Errors);

        var teamResult = await teamReadService.Get(x => x.Id == invitationResult.Value.TeamId);
        if (!teamResult.IsSuccess)
            return Result.Fail(teamResult.Errors);

        var mappedResponse = teamResponseMapper.Map(teamResult.Value);
        mappedResponse.Permissions = (int)invitationResult.Value.DefaultRole.Permissions;
        mappedResponse.RoleName = invitationResult.Value.DefaultRole.Name;

        return mappedResponse;
    }
}
