using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Request.ProspectLayout;

namespace Quark.Controllers.ProspectLayoutController;

public partial class ProspectLayoutController
{
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Update(UpdateProspectLayoutRequestDto request)
    {
        var result = await layoutService.UpdateTemplate(request, User);

        if (result.IsFailed)
            return NotFound(new { result.Errors[0].Message });

        return NoContent();
    }
}
