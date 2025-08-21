using Microsoft.AspNetCore.Mvc;

namespace Quark.Controllers.TeamInvitationController;

public partial class TeamInvitationController
{
    [HttpPost("revoke/{teamId:guid}/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Revoke(Guid teamId, Guid id)
    {
        var result = await invitationService.Revoke(teamId, id, User);

        if (result.IsFailed)
            return BadRequest(new { result.Errors[0].Message });

        return NoContent();
    }
}
