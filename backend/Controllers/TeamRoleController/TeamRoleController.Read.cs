using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Response.TeamRoles;

namespace Quark.Controllers.TeamRoleController;

public partial class TeamRoleController
{
    [HttpGet("{teamId:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<TeamRoleResponseDto>>> Get(
        Guid teamId,
        CancellationToken cancellationToken
    )
    {
        var result = await teamRoleService.Get(teamId, User, cancellationToken);

        if (result.IsFailed)
            return NotFound(new { result.Errors[0].Message });

        return Ok(result.Value);
    }
}
