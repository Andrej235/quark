namespace Quark.Dtos.Response.Prospect;

public class PartialProspectResponseDto
{
    public int Id { get; set; }
    public Guid TeamId { get; set; }
    public bool Archived { get; set; }
    public IEnumerable<ProspectFieldResponseDto> Fields { get; set; } = [];
}
