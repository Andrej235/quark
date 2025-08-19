using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Request.TeamRoles;
using Quark.Dtos.Response.TeamRoles;

namespace Quark.Controllers.TeamRoleController;

public partial class TeamRoleController
{
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<TeamRoleResponseDto>> Create(
        [FromBody] CreateTeamRoleRequestDto request
    )
    {
        var result = await teamRoleService.Create(request, User);

        if (!result.IsSuccess)
            return BadRequest(new { result.Errors[0].Message });

        return Created((string?)null, result.Value);
    }
}
