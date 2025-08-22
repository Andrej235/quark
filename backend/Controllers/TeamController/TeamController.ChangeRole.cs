using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Request.Team;

namespace Quark.Controllers.TeamController;

public partial class TeamController
{
    [Authorize]
    [HttpPatch("{teamId}/members/role")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> ChangeRole(
        Guid teamId,
        [FromBody] ChangeMemberRoleRequestDto request
    )
    {
        var result = await teamService.ChangeRole(teamId, request, User);

        if (result.IsFailed)
            return NotFound(new { result.Errors[0].Message });

        return NoContent();
    }
}
