namespace Quark.Dtos.Response.Prospect;

public class ProspectResponseDto
{
    public int Id { get; set; }
    public Guid TeamId { get; set; }

    public Guid? LayoutId { get; set; }
    public IEnumerable<ProspectFieldResponseDto> Fields { get; set; } = [];
}
