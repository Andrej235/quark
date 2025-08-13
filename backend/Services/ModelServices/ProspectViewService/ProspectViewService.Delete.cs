using System.Security.Claims;
using FluentResults;
using Quark.Errors;

namespace Quark.Services.ModelServices.ProspectViewService;

public partial class ProspectViewService
{
    public async Task<Result> Delete(Guid teamId, string ids, ClaimsPrincipal claims)
    {
        var unwrappedIds = ids.Split(',').Where(x => !string.IsNullOrEmpty(x));
        if (unwrappedIds.Count() == 0)
            return Result.Fail(new BadRequest("No ids provided"));

        var result = await deleteService.Delete(x =>
            unwrappedIds.Contains(x.Id) && x.TeamId == teamId
        );
        return result;
    }
}
