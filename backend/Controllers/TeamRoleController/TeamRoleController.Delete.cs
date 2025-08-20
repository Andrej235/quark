using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Quark.Controllers.TeamRoleController;

public partial class TeamRoleController
{
    [Authorize]
    [HttpDelete("{teamId:guid}/{roleId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(Guid teamId, Guid roleId)
    {
        var result = await teamRoleService.Delete(teamId, roleId, User);

        if (result.IsFailed)
            return NotFound(new { result.Errors[0].Message });

        return NoContent();
    }
}
