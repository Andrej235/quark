using Microsoft.AspNetCore.Identity;
using Quark.Dtos.Request.Team;
using Quark.Dtos.Response.Team;
using Quark.Models;
using Quark.Services.Create;
using Quark.Services.Mapping.Request;
using Quark.Services.Mapping.Response;
using Quark.Services.Read;

namespace Quark.Services.ModelServices.TeamService;

public partial class TeamService(
    ICreateSingleService<Team> createSingleService,
    ICreateSingleService<TeamMember> createTeamMemberService,
    ICreateSingleService<TeamInvitation> createInvitationService,
    IReadSingleSelectedService<User> userReadSelectedService,
    IRequestMapper<CreateTeamRequestDto, Team> createRequestMapper,
    IResponseMapper<Team, TeamResponseDto> responseMapper,
    UserManager<User> userManager
) : ITeamService;
