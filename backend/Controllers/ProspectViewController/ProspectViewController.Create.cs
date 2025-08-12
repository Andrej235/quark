using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Request.ProspectListViewItem;

namespace Quark.Controllers.ProspectViewController;

public partial class ProspectViewController
{
    [Authorize]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Create([FromBody] AddProspectViewItemsRequestDto dto)
    {
        var result = await viewService.Create(dto, User);

        if (result.IsFailed)
            return NotFound(new { result.Errors[0].Message });

        return Created();
    }
}
