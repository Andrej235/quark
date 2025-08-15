using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.Prospect;
using Quark.Errors;
using Quark.Models.Enums;
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
        bool archived,
        ClaimsPrincipal claims
    )
    {
        var fieldsToInclude = include.Split(',');
        if (!fieldsToInclude.Contains(sortBy))
            return new BadRequest("Trying to sort by a non-included field");

        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await teamPermissionsService.HasPermission(
            userId,
            teamId,
            TeamPermission.CanViewProspects
        );
        if (!hasPermission)
            return new Forbidden("You do not have permission to view prospects");

        var result = await paginationService.GetPage(
            x => x.Fields.First(x => x.Id == sortBy).Value,
            x => new PartialProspectResponseDto
            {
                Id = x.Id,
                Archived = x.Archived,
                TeamId = x.TeamId,
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
            x => x.TeamId == teamId && x.Archived == archived
        );

        return result;
    }

    public async Task<Result<ProspectResponseDto>> GetFull(
        Guid teamId,
        Guid prospectId,
        ClaimsPrincipal claims
    )
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await teamPermissionsService.HasPermission(
            userId,
            teamId,
            TeamPermission.CanViewProspects
        );
        if (!hasPermission)
            return new Forbidden("You do not have permission to view prospects");

        return await readService.Get(
            x => new ProspectResponseDto()
            {
                Id = x.Id,
                LayoutId = x.LayoutId,
                TeamId = x.TeamId,
                Archived = x.Archived,
                Fields = x.Fields.Select(x => new ProspectFieldResponseDto
                {
                    Id = x.Id,
                    Value = x.Value,
                    Type = x.Type,
                }),
            },
            x => x.Id == prospectId && x.TeamId == teamId
        );
    }
}
