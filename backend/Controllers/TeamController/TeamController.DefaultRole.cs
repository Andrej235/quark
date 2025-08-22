using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Request.Team;

namespace Quark.Controllers.TeamController;

public partial class TeamController
{
    [HttpPatch("{teamId:guid}/default-role")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> SetDefaultRole(
        Guid teamId,
        [FromBody] SetDefaultRoleRequestDto request
    )
    {
        var result = await teamService.SetDefaultRole(teamId, request, User);

        if (result.IsFailed)
            return NotFound(new { result.Errors[0].Message });

        return NoContent();
    }
}
