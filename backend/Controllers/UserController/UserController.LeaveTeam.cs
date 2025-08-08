using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Quark.Controllers.UserController;

public partial class UserController
{
    [Authorize]
    [HttpDelete("leave-team/{teamId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> LeaveTeam(Guid teamId)
    {
        var result = await userService.LeaveTeam(teamId, User);

        if (result.IsFailed)
            return NotFound(new { result.Errors[0].Message });

        return NoContent();
    }
}
