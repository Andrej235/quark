using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Request.Prospect;

namespace Quark.Controllers.ProspectController;

public partial class ProspectController
{
    [HttpPatch]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> Update(UpdateProspectRequestDto request)
    {
        var result = await prospectService.Update(request, User);

        if (result.IsFailed)
            return BadRequest(new { result.Errors[0].Message });

        return NoContent();
    }

    [HttpPatch("{teamId:guid}/{prospectId:int}/archive")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> Archive(Guid teamId, int prospectId)
    {
        var result = await prospectService.Archive(teamId, prospectId, User);

        if (result.IsFailed)
            return BadRequest(new { result.Errors[0].Message });

        return NoContent();
    }

    [HttpPatch("{teamId:guid}/{prospectId:int}/unarchive")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> Unarchive(Guid teamId, int prospectId)
    {
        var result = await prospectService.Unarchive(teamId, prospectId, User);

        if (result.IsFailed)
            return BadRequest(new { result.Errors[0].Message });

        return NoContent();
    }
}
