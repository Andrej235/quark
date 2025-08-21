using Microsoft.AspNetCore.Identity;
using Quark.Dtos.Request.Team;
using Quark.Dtos.Response.Team;
using Quark.Models;
using Quark.Services.Create;
using Quark.Services.Mapping.Request;
using Quark.Services.Mapping.Response;
using Quark.Services.Read;
using Quark.Services.TeamPermissions;
using Quark.Services.Update;

namespace Quark.Services.ModelServices.TeamService;

public partial class TeamService(
    ICreateSingleService<Team> createSingleService,
    ICreateSingleService<TeamMember> createTeamMemberService,
    ICreateSingleService<TeamInvitation> createInvitationService,
    IReadSingleSelectedService<User> userReadSelectedService,
    IReadRangeSelectedService<TeamMember> memberReadService,
    IRequestMapper<CreateTeamRequestDto, Team> createRequestMapper,
    IResponseMapper<Team, TeamResponseDto> responseMapper,
    IExecuteUpdateService<Team> updateService,
    IExecuteUpdateService<TeamInvitation> invitationUpdateService,
    UserManager<User> userManager,
    ITeamPermissionsService permissionsService
) : ITeamService;
