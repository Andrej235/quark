using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Quark.Dtos.Request.User;
using Quark.Errors;
using Quark.Utilities;

namespace Quark.Controllers.UserController;

public partial class UserController
{
    [HttpPost("send-reset-password-email")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [EnableRateLimiting(RateLimitingPolicies.EmailConfirmation)]
    public async Task<ActionResult> SendPasswordResetEmail(
        [FromBody] SendResetPasswordEmailRequestDto request
    )
    {
        var result = await userService.SendResetPasswordEmail(request);

        if (result.IsFailed)
        {
            if (result.HasError<NotFound>())
                return NotFound(new { result.Errors[0].Message });

            return BadRequest(new { result.Errors[0].Message });
        }

        return Ok();
    }

    [HttpPatch("reset-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [EnableRateLimiting(RateLimitingPolicies.EmailConfirmation)]
    public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request)
    {
        var result = await userService.ResetPassword(request);

        if (result.IsFailed)
        {
            if (result.HasError<NotFound>())
                return NotFound(new { result.Errors[0].Message });

            return BadRequest(new { result.Errors[0].Message });
        }

        return Ok();
    }
}
