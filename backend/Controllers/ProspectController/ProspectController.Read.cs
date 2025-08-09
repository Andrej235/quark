using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Response;
using Quark.Dtos.Response.Prospect;
using Quark.Utilities;

namespace Quark.Controllers.ProspectController;

public partial class ProspectController
{
    [Authorize]
    [HttpGet("partial/{teamId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PaginatedResponseDto<PartialProspectResponseDto>>> GetPartial(
        Guid teamId,
        [FromQuery] string sortBy,
        [FromQuery] string include,
        [FromQuery] string? cursor
    )
    {
        var result = await prospectService.GetPartial(teamId, sortBy, include, cursor, User);

        if (result.IsFailed)
            return BadRequest(new { result.Errors[0].Message });

        return Ok(result.Value.ToResponseDto());
    }
}
