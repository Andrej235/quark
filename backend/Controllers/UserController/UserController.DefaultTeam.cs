using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Quark.Controllers.UserController;

public partial class UserController
{
    [Authorize]
    [HttpPatch("set-default-team/{teamId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> SetTeamAsDefault(Guid teamId)
    {
        var result = await userService.SetTeamAsDefault(teamId, User);

        if (result.IsFailed)
            return NotFound(new { result.Errors[0].Message });

        return NoContent();
    }
}
