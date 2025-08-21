using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Response.TeamInvitation;

namespace Quark.Controllers.TeamInvitationController;

public partial class TeamInvitationController
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<TeamInvitationResponseDto>>> GetAll(
        CancellationToken cancellationToken
    )
    {
        var result = await invitationService.GetAll(User, cancellationToken);

        if (result.IsFailed)
            return BadRequest(new { result.Errors[0].Message });

        return Ok(result.Value);
    }

    [HttpGet("pending")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<TeamInvitationResponseDto>>> GetPending(
        CancellationToken cancellationToken
    )
    {
        var result = await invitationService.GetPending(User, cancellationToken);

        if (result.IsFailed)
            return BadRequest(new { result.Errors[0].Message });

        return Ok(result.Value);
    }
}
