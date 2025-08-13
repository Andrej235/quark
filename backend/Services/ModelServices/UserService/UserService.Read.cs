using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.User;
using Quark.Errors;
using Quark.Services.Read;

namespace Quark.Services.ModelServices.UserService;

public partial class UserService
{
    public async Task<Result<UserResponseDto>> Get(ClaimsPrincipal claim)
    {
        var userId = userManager.GetUserId(claim);
        if (userId is null)
            return Result.Fail(new NotFound("User not found"));

        var userResult = await userReadService.Get(
            x => x.Id == userId,
            q =>
                q.Include(x => x.MemberOfTeams)
                    .ThenInclude(x => x.Team)
                    .Include(x => x.MemberOfTeams)
                    .ThenInclude(x => x.Role)
        );

        return responseMapper.Map(userResult.Value);
    }
}
