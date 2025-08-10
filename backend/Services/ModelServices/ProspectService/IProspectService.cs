using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.Prospect;
using Quark.Dtos.Response.Prospect;
using Quark.Services.Read.KeysetPagination;

namespace Quark.Services.ModelServices.ProspectService;

public interface IProspectService
{
    Task<Result<CreateProspectResponseDto>> Create(
        CreateProspectRequestDto request,
        ClaimsPrincipal claims
    );

    Task<Result<PaginatedResult<PartialProspectResponseDto, KeysetCursor<string?>>>> GetPartial(
        Guid teamId,
        string sortBy,
        string include,
        string? cursorToken,
        ClaimsPrincipal claims
    );

    Task<Result<ProspectResponseDto>> GetFull(Guid teamId, Guid prospectId, ClaimsPrincipal claims);
}
