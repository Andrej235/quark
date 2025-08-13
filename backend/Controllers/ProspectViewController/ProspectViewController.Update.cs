using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Request.ProspectListViewItem;

namespace Quark.Controllers.ProspectViewController;

public partial class ProspectViewController
{
    [Authorize]
    [HttpPut("{teamId:guid}/replace-all")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ReplaceAll(
        [FromBody] AddProspectViewItemsRequestDto request,
        Guid teamId
    )
    {
        var result = await viewService.Replace(teamId, request, User);

        if (result.IsFailed)
            return BadRequest(new { result.Errors[0].Message });

        return NoContent();
    }
}
