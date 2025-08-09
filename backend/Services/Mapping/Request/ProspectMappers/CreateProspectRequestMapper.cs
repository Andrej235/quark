using Quark.Dtos.Request.Prospect;
using Quark.Models;

namespace Quark.Services.Mapping.Request.ProspectMappers;

public class CreateProspectRequestMapper(
    IRequestMapper<CreateProspectFieldRequestDto, ProspectDataField> fieldMapper
) : IRequestMapper<CreateProspectRequestDto, Prospect>
{
    public Prospect Map(CreateProspectRequestDto from) =>
        new() { TeamId = from.TeamId, Fields = [.. from.Fields.Select(fieldMapper.Map)] };
}
