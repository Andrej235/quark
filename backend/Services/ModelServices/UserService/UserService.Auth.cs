using System.Web;
using FluentResults;
using Quark.Dtos.Request.User;
using Quark.Errors;
using Quark.Models;

namespace Quark.Services.ModelServices.UserService;

public partial class UserService
{
    public async Task<Result> Register(RegisterRequestDto request)
    {
        var user = new User { Email = request.Email, UserName = request.Username };
        var userResult = await userManager.CreateAsync(user, request.Password);

        if (!userResult.Succeeded)
            return Result.Fail(userResult.Errors.Select(x => new BadRequest(x.Description)));

        var emailToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
        await emailSender.SendConfirmationLinkAsync(
            user,
            request.Email,
            $"{configuration["FrontendUrl"]}/confirm-email?token={HttpUtility.UrlEncode(emailToken)}&email={HttpUtility.UrlEncode(request.Email)}"
        );

        return Result.Ok();
    }
}
