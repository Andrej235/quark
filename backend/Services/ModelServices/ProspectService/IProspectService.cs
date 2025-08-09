using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.Prospect;
using Quark.Dtos.Response.Prospect;

namespace Quark.Services.ModelServices.ProspectService;

public interface IProspectService
{
    Task<Result<CreateProspectResponseDto>> Create(
        CreateProspectRequestDto request,
        ClaimsPrincipal claims
    );
}
