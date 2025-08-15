using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.ProspectListViewItem;
using Quark.Errors;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.ProspectViewService;

public partial class ProspectViewService
{
    public async Task<Result> Create(
        Guid teamId,
        AddProspectViewItemsRequestDto request,
        ClaimsPrincipal claims
    )
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await permissionsService.HasPermission(
            userId,
            teamId,
            TeamPermission.CanEditProspectLayout
        );
        if (!hasPermission)
            return new Forbidden("You do not have permission to edit prospect layout");

        var result = await createService.Add(request.Items.Select(createRequestMapper.Map));
        return result;
    }
}
