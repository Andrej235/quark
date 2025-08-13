namespace Quark.Dtos.Request.Prospect;

public class UpdateProspectRequestDto
{
    public int ProspectId { get; set; }
    public Guid TeamId { get; set; }
    public IEnumerable<CreateProspectFieldRequestDto> Fields { get; set; } = null!;
}
