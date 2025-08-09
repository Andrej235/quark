using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Request.Prospect;

namespace Quark.Controllers.ProspectController;

public partial class ProspectController
{
    [Authorize]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> Create(CreateProspectRequestDto request)
    {
        var result = await prospectService.Create(request, User);

        if (result.IsFailed)
            return BadRequest(new { result.Errors[0].Message });

        return Created((string?)null, result.Value);
    }
}
