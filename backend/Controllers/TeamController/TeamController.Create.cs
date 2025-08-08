using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Request.Team;
using Quark.Dtos.Response.Team;

namespace Quark.Controllers.TeamController;

public partial class TeamController
{
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<TeamResponseDto>> Create([FromBody] CreateTeamRequestDto request)
    {
        var result = await teamService.CreateTeam(request, User);

        if (!result.IsSuccess)
            return BadRequest(new { result.Errors[0].Message });

        return Created((string?)null, result.Value);
    }
}
