using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.User;
using Quark.Errors;

namespace Quark.Services.ModelServices.UserService;

public partial class UserService
{
    public async Task<Result> UpdateInfo(UpdateUserInfoRequestDto request, ClaimsPrincipal claims)
    {
        var user = await userManager.GetUserAsync(claims);
        if (user is null)
            return new Unauthorized();

        var usernameUpdate = userManager.SetUserNameAsync(user, request.Username);
        if (!usernameUpdate.Result.Succeeded)
            return new BadRequest(usernameUpdate.Result.Errors.First().Description);

        var result = await userUpdateService.Update(
            x => x.Id == user.Id,
            x =>
                x.SetProperty(x => x.FirstName, request.FirstName)
                    .SetProperty(x => x.LastName, request.LastName)
        );

        if (result.IsFailed)
            return result;

        return Result.Ok();
    }

    public async Task<Result> UpdatePassword(
        UpdatePasswordRequestDto request,
        ClaimsPrincipal claims
    )
    {
        if (request.OldPassword.Trim() == request.NewPassword.Trim())
            return new BadRequest("New password must be different from the old one");

        var user = await userManager.GetUserAsync(claims);
        if (user is null)
            return new Unauthorized();

        var result = await userManager.ChangePasswordAsync(
            user,
            request.OldPassword,
            request.NewPassword
        );

        if (!result.Succeeded)
            return new Unauthorized();

        return Result.Ok();
    }

    public Task<Result> UpdateProfilePicture(
        UpdateProfilePictureRequestDto request,
        ClaimsPrincipal claims
    )
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return Task.FromResult(Result.Fail(new Unauthorized()));

        return userUpdateService.Update(
            x => x.Id == userId,
            x => x.SetProperty(x => x.ProfilePicture, request.ProfilePicture)
        );
    }
}
