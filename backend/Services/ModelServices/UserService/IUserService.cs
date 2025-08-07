using FluentResults;
using Quark.Dtos.Request.User;

namespace Quark.Services.ModelServices.UserService;

public interface IUserService
{
    Task<Result> Register(RegisterRequestDto request);

    Task<Result> ResendConfirmationEmail(string email);
    Task<Result> ConfirmEmail(ConfirmEmailRequestDto request);

    Task<Result> SendResetPasswordEmail(SendResetPasswordEmailRequestDto request);
    Task<Result> ResetPassword(ResetPasswordRequestDto request);
}
