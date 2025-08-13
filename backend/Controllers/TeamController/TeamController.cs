using Microsoft.AspNetCore.Mvc;
using Quark.Services.ModelServices.TeamService;

namespace Quark.Controllers.TeamController;

[Route("teams")]
[ApiController]
[ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
public partial class TeamController(ITeamService teamService) : ControllerBase;
