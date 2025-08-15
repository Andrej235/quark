using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.ProspectLayout;
using Quark.Errors;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.ProspectLayoutService;

public partial class ProspectLayoutService
{
    public async Task<Result<ProspectLayoutResponseDto>> GetDefaultTemplateForTeam(
        Guid teamId,
        ClaimsPrincipal claims,
        CancellationToken cancellationToken
    )
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await permissionsService.HasPermission(
            userId,
            teamId,
            TeamPermission.CanViewProspects
        );
        if (!hasPermission)
            return new Forbidden("You do not have permission to view prospects");

        var teamResult = await teamReadSelectedService.Get(
            x => x.DefaultProspectLayout,
            x => x.Id == teamId,
            cancellationToken: cancellationToken
        );

        return new ProspectLayoutResponseDto()
        {
            Id = teamResult.Value.Id,
            JsonStructure = teamResult.Value.JsonStructure.RootElement.GetRawText(),
        };
    }
}
