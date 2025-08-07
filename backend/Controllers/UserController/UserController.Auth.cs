using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Request.User;

namespace Quark.Controllers.UserController;

public partial class UserController
{
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Register([FromBody] RegisterRequestDto request)
    {
        var result = await userService.Register(request);

        if (result.IsFailed)
            return BadRequest(new { result.Errors[0].Message });

        return Ok();
    }

    [Authorize]
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return Ok();
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> Login([FromBody] LoginRequestDto request)
    {
        var result = await signInManager.PasswordSignInAsync(
            request.Username,
            request.Password,
            true,
            false
        );

        if (!result.Succeeded)
            return Unauthorized(new { Message = "Invalid username or password." });

        return Ok();
    }
}
