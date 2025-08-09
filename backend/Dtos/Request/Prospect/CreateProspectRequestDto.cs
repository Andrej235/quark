namespace Quark.Dtos.Request.Prospect;

public class CreateProspectRequestDto
{
    public Guid TeamId { get; set; }
    public IEnumerable<CreateProspectFieldRequestDto> Fields { get; set; } = null!;
}
