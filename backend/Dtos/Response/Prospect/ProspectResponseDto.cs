namespace Quark.Dtos.Response.Prospect;

public class ProspectResponseDto
{
    public Guid Id { get; set; }
    public Guid? LayoutId { get; set; }
    public IEnumerable<ProspectFieldResponseDto> Fields { get; set; } = [];
}
