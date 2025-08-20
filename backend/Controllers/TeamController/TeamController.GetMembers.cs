using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Response.Team;

namespace Quark.Controllers.TeamController;

public partial class TeamController
{
    [HttpGet("{teamId:guid}/members")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<TeamMemberResponseDto>>> GetMembers(
        Guid teamId,
        CancellationToken cancellationToken
    )
    {
        var result = await teamService.GetMembers(teamId, User, cancellationToken);

        if (result.IsFailed)
            return NotFound(new { result.Errors[0].Message });

        return Ok(result.Value);
    }
}
