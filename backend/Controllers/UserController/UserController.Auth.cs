using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Request.User;
using Quark.Dtos.Response.User;
using Quark.Utilities;

namespace Quark.Controllers.UserController;

public partial class UserController
{
    [Authorize]
    [HttpGet("check-auth")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public Task<OkResult> CheckAuth() => Task.FromResult(Ok());

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

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<TokensResponseDto?>> Login([FromBody] LoginRequestDto request)
    {
        var result = await userService.Login(request);

        if (result.IsFailed)
            return BadRequest(new { Message = "Invalid username or password" });

        return Ok(result.Value);
    }

    [HttpPost("refresh")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TokensResponseDto>> Refresh(
        [FromBody] RefreshTokensRequestDto request
    )
    {
        var result = await userService.Refresh(request);

        if (result.IsFailed)
            return BadRequest(result.Errors[0]);

        return Ok(result.Value);
    }

    [Authorize]
    [HttpPost("logout/cookie")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> LogoutCookie()
    {
        await signInManager.SignOutAsync();
        return Ok();
    }

    [Authorize(Policy = AuthPolicies.JwtOnly)]
    [HttpPost("logout/token")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> LogoutToken([FromBody] LogoutRequestDto request)
    {
        await userService.Logout(request);
        return Ok();
    }
}
