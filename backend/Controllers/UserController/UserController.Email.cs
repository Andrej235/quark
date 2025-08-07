using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Quark.Dtos.Request.User;
using Quark.Utilities;

namespace Quark.Controllers.UserController;

public partial class UserController
{
    [HttpPost("confirm-email")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [EnableRateLimiting(RateLimitingPolicies.EmailConfirmation)]
    public async Task<ActionResult> ConfirmEmail([FromBody] ConfirmEmailRequestDto request)
    {
        var result = await userService.ConfirmEmail(request);

        if (result.IsFailed)
            return BadRequest(new { result.Errors[0].Message });

        return Ok();
    }

    [HttpPost("resend-confirmation-email")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [EnableRateLimiting(RateLimitingPolicies.EmailConfirmation)]
    public async Task<ActionResult> ResendConfirmationEmail([FromQuery] string email)
    {
        var result = await userService.ResendConfirmationEmail(email);

        if (result.IsFailed)
            return BadRequest(new { result.Errors[0].Message });

        return Ok();
    }
}
