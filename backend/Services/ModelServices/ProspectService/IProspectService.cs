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
        bool archived,
        ClaimsPrincipal claims,
        CancellationToken cancellationToken
    );
    Task<Result<ProspectResponseDto>> GetFull(
        Guid teamId,
        Guid prospectId,
        ClaimsPrincipal claims,
        CancellationToken cancellationToken
    );

    Task<Result> Update(UpdateProspectRequestDto request, ClaimsPrincipal claims);
    Task<Result> Archive(Guid teamId, Guid prospectId, ClaimsPrincipal claims);
    Task<Result> Unarchive(Guid teamId, Guid prospectId, ClaimsPrincipal claims);
}
