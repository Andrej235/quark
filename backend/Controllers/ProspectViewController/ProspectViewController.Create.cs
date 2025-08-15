using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Request.ProspectListViewItem;

namespace Quark.Controllers.ProspectViewController;

public partial class ProspectViewController
{
    [Authorize]
    [HttpPost("{teamId:guid}")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Create(
        Guid teamId,
        [FromBody] AddProspectViewItemsRequestDto dto
    )
    {
        var result = await viewService.Create(teamId, dto, User);

        if (result.IsFailed)
            return NotFound(new { result.Errors[0].Message });

        return Created();
    }
}
