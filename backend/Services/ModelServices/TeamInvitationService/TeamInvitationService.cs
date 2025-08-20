using Microsoft.AspNetCore.Identity;
using Quark.Dtos.Response.Team;
using Quark.Models;
using Quark.Services.Create;
using Quark.Services.Mapping.Response;
using Quark.Services.Read;
using Quark.Services.Update;

namespace Quark.Services.ModelServices.TeamInvitationService;

public partial class TeamInvitationService(
    ICreateSingleService<TeamMember> createMemberService,
    IReadSingleSelectedService<TeamInvitation> readSingleService,
    IReadRangeSelectedService<TeamInvitation> readService,
    IReadSingleService<Team> teamReadService,
    IExecuteUpdateService<TeamInvitation> updateService,
    IResponseMapper<Team, TeamResponseDto> teamResponseMapper,
    UserManager<User> userManager
) : ITeamInvitationService;
