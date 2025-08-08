using System.Security.Claims;
using System.Text.Json;
using FluentResults;
using Quark.Dtos.Request.ProspectLayout;

namespace Quark.Services.ModelServices.ProspectLayoutService;

public partial class ProspectLayoutService
{
    public Task<Result> UpdateTemplate(
        UpdateProspectLayoutRequestDto template,
        ClaimsPrincipal claims
    )
    {
        var json = JsonDocument.Parse(template.NewJsonStructure);

        return updateService.Update(
            x => x.Id == template.Id,
            x => x.SetProperty(x => x.JsonStructure, json)
        );
    }
}
