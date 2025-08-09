using Quark.Dtos.Request.Prospect;
using Quark.Models;

namespace Quark.Services.Mapping.Request.ProspectMappers;

public class CreateProspectFieldRequestMapper
    : IRequestMapper<CreateProspectFieldRequestDto, ProspectDataField>
{
    public ProspectDataField Map(CreateProspectFieldRequestDto from) =>
        new()
        {
            Id = from.Id,
            Type = from.Type,
            Value = from.Value,
        };
}
