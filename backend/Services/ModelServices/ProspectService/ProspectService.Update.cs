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
                Type = x.Type,
            })
        );
    }
}
