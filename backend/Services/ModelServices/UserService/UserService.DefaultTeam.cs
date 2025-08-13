using System.Security.Claims;
using FluentResults;

namespace Quark.Services.ModelServices.UserService;

public partial class UserService
{
    public Task<Result> SetTeamAsDefault(Guid teamId, ClaimsPrincipal claim)
    {
        var userId = userManager.GetUserId(claim);

        return userUpdateService.Update(
            x => x.Id == userId,
            x => x.SetProperty(x => x.DefaultTeamId, teamId)
        );
    }
}
