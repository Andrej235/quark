using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.ProspectLayout;

namespace Quark.Services.ModelServices.ProspectLayoutService;

public interface IProspectLayoutService
{
    Task<Result<ProspectLayoutResponseDto>> GetDefaultTemplateForTeam(
        Guid teamId,
        ClaimsPrincipal claims
    );
}
