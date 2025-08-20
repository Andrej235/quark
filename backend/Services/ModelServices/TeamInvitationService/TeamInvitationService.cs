using Microsoft.AspNetCore.Identity;
using Quark.Models;
using Quark.Services.Create;
using Quark.Services.Read;
using Quark.Services.Update;

namespace Quark.Services.ModelServices.TeamInvitationService;

public partial class TeamInvitationService(
    ICreateSingleService<TeamMember> createMemberService,
    IReadSingleSelectedService<TeamInvitation> readSingleService,
    IReadRangeSelectedService<TeamInvitation> readService,
    IExecuteUpdateService<TeamInvitation> updateService,
    UserManager<User> userManager
) : ITeamInvitationService;
