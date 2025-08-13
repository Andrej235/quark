using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.Prospect;
using Quark.Dtos.Response.Prospect;
using Quark.Errors;

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

        var mapped = createRequestMapper.Map(request);
        var result = await createService.Add(mapped);

        if (result.IsFailed)
            return Result.Fail(result.Errors);

        return new CreateProspectResponseDto() { Id = result.Value.Id };
    }
}
