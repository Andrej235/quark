namespace Quark.Dtos.Response.Prospect;

public class PartialProspectResponseDto
{
    public Guid Id { get; set; }
    public IEnumerable<ProspectFieldResponseDto> Fields { get; set; } = [];
}
