using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.ProspectLayout;
using Quark.Dtos.Response.ProspectLayout;

namespace Quark.Services.ModelServices.ProspectLayoutService;

public interface IProspectLayoutService
{
    Task<Result<ProspectLayoutResponseDto>> GetDefaultTemplateForTeam(
        Guid teamId,
        ClaimsPrincipal claims,
        CancellationToken cancellationToken
    );

    Task<Result> UpdateTemplate(UpdateProspectLayoutRequestDto request, ClaimsPrincipal claims);
}
