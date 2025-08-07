using System.Web;
using FluentResults;
using Quark.Dtos.Request.User;
using Quark.Errors;

namespace Quark.Services.ModelServices.UserService;

public partial class UserService
{
    public async Task<Result> ConfirmEmail(ConfirmEmailRequestDto request)
    {
        var user = await userManager.FindByEmailAsync(HttpUtility.UrlDecode(request.Email));
        if (user is null)
            return Result.Fail(new NotFound("User not found"));

        var result = await userManager.ConfirmEmailAsync(user, request.Token);
        if (!result.Succeeded)
            return Result.Fail(
                new BadRequest(string.Join(", ", result.Errors.Select(x => x.Description)))
            );

        return Result.Ok();
    }

    public async Task<Result> ResendConfirmationEmail(string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
            return Result.Fail(new Unauthorized());

        if (user.Email is null)
            return Result.Fail(new BadRequest("Email not found"));

        if (user.EmailConfirmed)
            return Result.Fail(new BadRequest("Email already confirmed"));

        var emailToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
        await emailSender.SendConfirmationLinkAsync(
            user,
            user.Email,
            $"{configuration["FrontendUrl"]}/confirm-email?token={HttpUtility.UrlEncode(emailToken)}&email={HttpUtility.UrlEncode(user.Email)}"
        );

        return Result.Ok();
    }
}
