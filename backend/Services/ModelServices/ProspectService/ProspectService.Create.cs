using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.Prospect;
using Quark.Dtos.Response.Prospect;
using Quark.Errors;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.ProspectService;

public partial class ProspectService
{
    public async Task<Result<CreateProspectResponseDto>> Create(
        CreateProspectRequestDto request,
        ClaimsPrincipal claims
    )
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await teamPermissionsService.HasPermission(
            userId,
            request.TeamId,
            TeamPermission.CanCreateProspects
        );
        if (!hasPermission)
            return Result.Fail(new Forbidden("You do not have permission to create prospects"));

        var mapped = createRequestMapper.Map(request);
        var result = await createService.Add(mapped);

        if (result.IsFailed)
            return Result.Fail(result.Errors);

        return new CreateProspectResponseDto() { Id = result.Value.Id };
    }
}
