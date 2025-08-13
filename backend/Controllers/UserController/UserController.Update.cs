using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quark.Dtos.Request.User;
using Quark.Errors;

namespace Quark.Controllers.UserController;

public partial class UserController
{
    [Authorize]
    [HttpPatch]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> UpdateInfo([FromBody] UpdateUserInfoRequestDto request)
    {
        var result = await userService.UpdateInfo(request, User);

        if (result.IsFailed)
            return BadRequest(new { result.Errors[0].Message });

        return NoContent();
    }

    [Authorize]
    [HttpPatch("password")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> UpdatePassword([FromBody] UpdatePasswordRequestDto request)
    {
        var result = await userService.UpdatePassword(request, User);

        if (result.IsFailed)
            return result.HasError<Unauthorized>()
                ? Unauthorized()
                : BadRequest(new { result.Errors[0].Message });

        return NoContent();
    }

    [Authorize]
    [HttpPatch("profile-picture")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> UpdateProfilePicture(
        [FromBody] UpdateProfilePictureRequestDto request
    )
    {
        var result = await userService.UpdateProfilePicture(request, User);

        if (result.IsFailed)
            return BadRequest(new { result.Errors[0].Message });

        return NoContent();
    }
}
