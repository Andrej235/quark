using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Quark.Controllers.ProspectViewController;

public partial class ProspectViewController
{
    [Authorize]
    [HttpDelete("{teamId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(Guid teamId, [FromQuery] string ids)
    {
        var result = await viewService.Delete(teamId, ids, User);

        if (result.IsFailed)
            return NotFound(new { result.Errors[0].Message });

        return NoContent();
    }
}
