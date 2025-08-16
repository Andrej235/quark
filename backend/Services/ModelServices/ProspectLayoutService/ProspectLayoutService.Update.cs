using System.Security.Claims;
using System.Text.Json;
using FluentResults;
using Quark.Dtos.Request.ProspectLayout;
using Quark.Errors;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.ProspectLayoutService;

public partial class ProspectLayoutService
{
    public async Task<Result> Update(UpdateProspectLayoutRequestDto request, ClaimsPrincipal claims)
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await permissionsService.HasPermission(
            userId,
            request.TeamId,
            TeamPermission.CanEditProspectLayout
        );
        if (!hasPermission)
            return new Forbidden("You do not have permission to edit prospect layout");

        var json = JsonDocument.Parse(request.NewJsonStructure);

        return await updateService.Update(
            x => x.Id == request.Id,
            x => x.SetProperty(x => x.JsonStructure, json)
        );
    }
}
