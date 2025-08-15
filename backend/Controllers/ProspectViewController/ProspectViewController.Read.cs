using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Response.ProspectListViewItem;

namespace Quark.Controllers.ProspectViewController;

public partial class ProspectViewController
{
    [Authorize]
    [HttpGet("{teamId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProspectViewResponseDto>> Read(
        Guid teamId,
        CancellationToken cancellationToken
    )
    {
        var result = await viewService.Get(teamId, User, cancellationToken);

        if (result.IsFailed)
            return NotFound(new { result.Errors[0].Message });

        return result.Value;
    }
}
