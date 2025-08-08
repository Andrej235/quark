using System.Security.Claims;
using FluentResults;

namespace Quark.Services.ModelServices.UserService;

public partial class UserService
{
    public Task<Result> LeaveTeam(Guid teamId, ClaimsPrincipal claim)
    {
        var userId = userManager.GetUserId(claim);
        return teamMemberDeleteService.Delete(x => x.UserId == userId);
    }
}
