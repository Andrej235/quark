using System.IdentityModel.Tokens.Jwt;
using System.Web;
using FluentResults;
using Quark.Dtos.Request.User;
using Quark.Dtos.Response.User;
using Quark.Errors;
using Quark.Models;

namespace Quark.Services.ModelServices.UserService;

public partial class UserService
{
    public async Task<Result> Register(RegisterRequestDto request)
    {
        var user = new User
        {
            Email = request.Email,
            UserName = request.Username,
            FirstName = request.FirstName,
            LastName = request.LastName,
            ProfilePicture = null,
        };
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

    public async Task<Result<TokensResponseDto>> Login(LoginRequestDto request)
    {
        var user = request.UsernameOrEmail.Contains('@')
            ? await userManager.FindByEmailAsync(request.UsernameOrEmail)
            : await userManager.FindByNameAsync(request.UsernameOrEmail);

        if (
            !request.UseCookies
            && user != null
            && await userManager.CheckPasswordAsync(user, request.Password)
        )
        {
            var accessToken = tokenService.GenerateJwtToken(user);
            var refreshToken = await tokenService.GenerateRefreshToken(user);

            return new TokensResponseDto() { Jwt = accessToken, RefreshToken = refreshToken };
        }

        if (
            request.UseCookies
            && user?.UserName is not null
            && await signInManager.PasswordSignInAsync(user.UserName, request.Password, true, false)
                is { Succeeded: true }
        )
        {
            return Result.Ok();
        }

        return Result.Fail(new Unauthorized());
    }

    public async Task<Result<TokensResponseDto>> Refresh(RefreshTokensRequestDto request)
    {
        var principal = tokenService.GetPrincipalFromExpiredToken(request.Jwt);
        var email = principal
            ?.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Name)
            ?.Value;

        if (email is null)
            return Result.Fail(new BadRequest("Invalid access token"));

        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
            return Result.Fail(new Unauthorized());

        var savedRefreshTokenResult = await tokenReadService.Get(t =>
            t.UserId == user.Id && t.Token == request.RefreshToken
        );

        if (savedRefreshTokenResult.IsFailed)
            return Result.Fail(savedRefreshTokenResult.Errors);

        var savedRefreshToken = savedRefreshTokenResult.Value;

        if (savedRefreshToken is null || savedRefreshToken.ExpiresUtc < DateTime.UtcNow)
            return Result.Fail(new BadRequest("Invalid or expired refresh token"));

        var newAccessToken = tokenService.GenerateJwtToken(user);
        var newRefreshToken = await tokenService.GenerateRefreshToken(user, savedRefreshToken);

        return new TokensResponseDto() { Jwt = newAccessToken, RefreshToken = newRefreshToken };
    }

    public Task<Result> Logout(LogoutRequestDto request)
    {
        return tokenDeleteService.Delete(x => x.Token == request.RefreshToken);
    }
}
