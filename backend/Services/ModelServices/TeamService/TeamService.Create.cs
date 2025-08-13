using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.Team;
using Quark.Dtos.Response.Team;
using Quark.Errors;
using Quark.Models;

namespace Quark.Services.ModelServices.TeamService;

public partial class TeamService
{
    public async Task<Result<TeamResponseDto>> CreateTeam(
        CreateTeamRequestDto request,
        ClaimsPrincipal claims
    )
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return Result.Fail(new Unauthorized());

        var mapped = createRequestMapper.Map(request);
        mapped.OwnerId = userId;

        var createResult = await createSingleService.Add(mapped);
        if (!createResult.IsSuccess)
            return Result.Fail(createResult.Errors);

        var newTeam = createResult.Value;
        var teamMemberResult = await createTeamMemberService.Add(
            new TeamMember
            {
                UserId = userId,
                TeamId = newTeam.Id,
                RoleId = newTeam.Roles.First(x => x.Name == "Owner").Id,
            }
        );

        if (!teamMemberResult.IsSuccess)
            return Result.Fail(teamMemberResult.Errors);

        var mappedResponse = responseMapper.Map(newTeam);
        mappedResponse.RoleName = teamMemberResult.Value.Role.Name;
        mappedResponse.Permissions = (int)teamMemberResult.Value.Role.Permissions;
        return mappedResponse;
    }
}
