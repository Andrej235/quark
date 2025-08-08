using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Response.ProspectLayout;

namespace Quark.Controllers.ProspectLayoutController;

public partial class ProspectLayoutController
{
    [HttpGet("default/{teamId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProspectLayoutResponseDto>> GetDefaultTemplate(Guid teamId)
    {
        var result = await layoutService.GetDefaultTemplateForTeam(teamId, User);

        if (result.IsFailed)
            return NotFound(new { result.Errors[0].Message });

        return result.Value;
    }
}
