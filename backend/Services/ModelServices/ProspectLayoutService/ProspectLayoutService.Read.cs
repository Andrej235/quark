using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.ProspectLayout;
using Quark.Errors;

namespace Quark.Services.ModelServices.ProspectLayoutService;

public partial class ProspectLayoutService
{
    public async Task<Result<ProspectLayoutResponseDto>> GetDefaultTemplateForTeam(
        Guid teamId,
        ClaimsPrincipal claims
    )
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return Result.Fail(new Unauthorized());

        var teamResult = await teamReadSelectedService.Get(
            x => x.DefaultProspectLayout.JsonStructure,
            x => x.Id == teamId
        );

        return new ProspectLayoutResponseDto()
        {
            JsonStructure = teamResult.Value.RootElement.GetRawText(),
        };
    }
}
