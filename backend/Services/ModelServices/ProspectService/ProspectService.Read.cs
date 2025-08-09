using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.Prospect;
using Quark.Errors;
using Quark.Services.Read.KeysetPagination;
using Quark.Utilities;

namespace Quark.Services.ModelServices.ProspectService;

public partial class ProspectService
{
    public async Task<
        Result<PaginatedResult<PartialProspectResponseDto, KeysetCursor<string?>>>
    > GetPartial(
        Guid teamId,
        string sortBy,
        string include,
        string? cursorToken,
        ClaimsPrincipal claims
    )
    {
        var fieldsToInclude = include.Split(',');
        if (!fieldsToInclude.Contains(sortBy))
            return new BadRequest("Trying to sort by a non-included field");

        var result = await paginationService.GetPage(
            x => x.Fields.First(x => x.Id == sortBy).Value,
            x => new PartialProspectResponseDto
            {
                Id = x.Id,
                Fields = x
                    .Fields.Where(x => fieldsToInclude.Contains(x.Id))
                    .Select(x => new ProspectFieldResponseDto
                    {
                        Id = x.Id,
                        Value = x.Value,
                        Type = x.Type,
                    }),
            },
            x => x.Fields.First(x => x.Id == sortBy).Value,
            cursorToken.ToKeysetCursor<string?>() ?? new KeysetCursor<string?>(null, 15),
            x => x.TeamId == teamId
        );

        return result;
    }
}
