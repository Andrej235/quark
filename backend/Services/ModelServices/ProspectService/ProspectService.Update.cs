using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.Prospect;
using Quark.Errors;
using Quark.Models;
using Quark.Models.Enums;

namespace Quark.Services.ModelServices.ProspectService;

public partial class ProspectService
{
    public async Task<Result> Update(UpdateProspectRequestDto request, ClaimsPrincipal claims)
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await teamPermissionsService.HasPermission(
            userId,
            request.TeamId,
            TeamPermission.CanEditProspects
        );
        if (!hasPermission)
            return Result.Fail(new Forbidden("You do not have permission to edit prospects"));

        return await fieldUpdateService.Update(
            request.Fields.Select(x => new ProspectDataField()
            {
                Id = x.Id,
                Value = x.Value,
                ProspectId = request.ProspectId,
                Type = x.Type,
            })
        );
    }

    public async Task<Result> Archive(Guid teamId, Guid prospectId, ClaimsPrincipal claims)
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await teamPermissionsService.HasPermission(
            userId,
            teamId,
            TeamPermission.CanArchiveProspects
        );
        if (!hasPermission)
            return Result.Fail(new Forbidden("You do not have permission to archive prospects"));

        var result = await updateService.Update(
            x => x.TeamId == teamId && x.Id == prospectId,
            x => x.SetProperty(x => x.Archived, true)
        );

        return result;
    }

    public async Task<Result> Unarchive(Guid teamId, Guid prospectId, ClaimsPrincipal claims)
    {
        var userId = userManager.GetUserId(claims);
        if (userId is null)
            return new Unauthorized();

        var hasPermission = await teamPermissionsService.HasPermission(
            userId,
            teamId,
            TeamPermission.CanArchiveProspects
        );
        if (!hasPermission)
            return Result.Fail(new Forbidden("You do not have permission to archive prospects"));

        var result = await updateService.Update(
            x => x.TeamId == teamId && x.Id == prospectId,
            x => x.SetProperty(x => x.Archived, false)
        );

        return result;
    }
}
