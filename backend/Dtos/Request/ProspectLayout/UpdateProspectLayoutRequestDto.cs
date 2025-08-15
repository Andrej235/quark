namespace Quark.Dtos.Request.ProspectLayout;

public class UpdateProspectLayoutRequestDto
{
    public Guid Id { get; set; }
    public Guid TeamId { get; set; }
    public string NewJsonStructure { get; set; } = null!;
}
