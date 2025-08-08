using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.User;
using Quark.Errors;

namespace Quark.Services.ModelServices.UserService;

public partial class UserService
{
    public async Task<Result<UserResponseDto>> Get(ClaimsPrincipal claim)
    {
        var user = await userManager.GetUserAsync(claim);
        if (user is null)
            return Result.Fail(new NotFound("User not found"));

        return responseMapper.Map(user);
    }
}
