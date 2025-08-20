using Microsoft.AspNetCore.Mvc;
using Quark.Services.ModelServices.TeamInvitationService;

namespace Quark.Controllers.TeamInvitationController;

[Route("team-invitations")]
[ApiController]
[ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
public partial class TeamInvitationController(ITeamInvitationService invitationService)
    : ControllerBase;
