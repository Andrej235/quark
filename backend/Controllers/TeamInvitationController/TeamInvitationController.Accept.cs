using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Response.Team;

namespace Quark.Controllers.TeamInvitationController;

public partial class TeamInvitationController
{
    [HttpPost("accept/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TeamResponseDto>> Accept(Guid id)
    {
        var result = await invitationService.Accept(id, User);

        if (result.IsFailed)
            return BadRequest(new { result.Errors[0].Message });

        return Ok(result.Value);
    }
}
