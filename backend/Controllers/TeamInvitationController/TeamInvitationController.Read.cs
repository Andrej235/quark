using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Response.TeamInvitation;

namespace Quark.Controllers.TeamInvitationController;

public partial class TeamInvitationController
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<TeamInvitationResponseDto>>> Read(
        CancellationToken cancellationToken
    )
    {
        var result = await invitationService.Get(User, cancellationToken);

        if (result.IsFailed)
            return BadRequest(new { result.Errors[0].Message });

        return Ok(result.Value);
    }
}
