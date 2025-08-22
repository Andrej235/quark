using Microsoft.AspNetCore.Identity;
using Quark.Dtos.Request.Team;
using Quark.Dtos.Response.Team;
using Quark.Models;
using Quark.Services.Create;
using Quark.Services.Delete;
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
    IReadSingleSelectedService<TeamMember> memberReadSingleService,
    IReadRangeSelectedService<TeamMember> memberReadService,
    IRequestMapper<CreateTeamRequestDto, Team> createRequestMapper,
    IResponseMapper<Team, TeamResponseDto> responseMapper,
    IExecuteUpdateService<Team> updateService,
    IExecuteUpdateService<TeamMember> memberUpdateService,
    IExecuteUpdateService<TeamInvitation> invitationUpdateService,
    IDeleteService<TeamMember> memberDeleteService,
    UserManager<User> userManager,
    ITeamPermissionsService permissionsService
) : ITeamService;
