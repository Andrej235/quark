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
            x => x.DefaultProspectLayout,
            x => x.Id == teamId
        );

        return new ProspectLayoutResponseDto()
        {
            Id = teamResult.Value.Id,
            JsonStructure = teamResult.Value.JsonStructure.RootElement.GetRawText(),
        };
    }
}
