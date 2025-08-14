using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.Prospect;
using Quark.Models;

namespace Quark.Services.ModelServices.ProspectService;

public partial class ProspectService
{
    public Task<Result> Update(UpdateProspectRequestDto request, ClaimsPrincipal claims)
    {
        return fieldUpdateService.Update(
            request.Fields.Select(x => new ProspectDataField()
            {
                Id = x.Id,
                Value = x.Value,
                ProspectId = request.ProspectId,
                TeamId = request.TeamId,
                Type = x.Type,
            })
        );
    }

    public async Task<Result> Archive(Guid teamId, int prospectId, ClaimsPrincipal claims)
    {
        var result = await updateService.Update(
            x => x.TeamId == teamId && x.Id == prospectId,
            x => x.SetProperty(x => x.Archived, true)
        );

        return result;
    }

    public async Task<Result> Unarchive(Guid teamId, int prospectId, ClaimsPrincipal claims)
    {
        var result = await updateService.Update(
            x => x.TeamId == teamId && x.Id == prospectId,
            x => x.SetProperty(x => x.Archived, false)
        );

        return result;
    }
}
