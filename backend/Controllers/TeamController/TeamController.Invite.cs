using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Request.Team;

namespace Quark.Controllers.TeamController;

public partial class TeamController
{
    [Authorize]
    [HttpPost("invite")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> InviteUser(InviteUserRequestDto request)
    {
        var result = await teamService.InviteUser(request, User);

        if (result.IsFailed)
            return NotFound(new { result.Errors[0].Message });

        return Created();
    }
}
