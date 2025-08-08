using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.Team;
using Quark.Dtos.Response.Team;

namespace Quark.Services.ModelServices.TeamService;

public interface ITeamService
{
    Task<Result<TeamResponseDto>> CreateTeam(CreateTeamRequestDto request, ClaimsPrincipal claims);
}
