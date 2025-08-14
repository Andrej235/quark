namespace Quark.Dtos.Request.Prospect;

public class UpdateProspectRequestDto
{
    public Guid ProspectId { get; set; }
    public Guid TeamId { get; set; }
    public IEnumerable<CreateProspectFieldRequestDto> Fields { get; set; } = null!;
}
