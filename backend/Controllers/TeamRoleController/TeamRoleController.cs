using Microsoft.AspNetCore.Mvc;
using Quark.Services.ModelServices.TeamRoleService;

namespace Quark.Controllers.TeamRoleController;

[Route("team-roles")]
[ApiController]
[ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
public partial class TeamRoleController(ITeamRoleService teamRoleService) : ControllerBase;
