using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.ProspectLayout;
using Quark.Dtos.Response.ProspectLayout;

namespace Quark.Services.ModelServices.ProspectLayoutService;

public interface IProspectLayoutService
{
    Task<Result<ProspectLayoutResponseDto>> GetDefaultForTeam(
        Guid teamId,
        ClaimsPrincipal claims,
        CancellationToken cancellationToken
    );

    Task<Result> Update(UpdateProspectLayoutRequestDto request, ClaimsPrincipal claims);
}
