using Quark.Models.Enums;

namespace Quark.Dtos.Request.Prospect;

public class CreateProspectFieldRequestDto
{
    public string Id { get; set; } = null!;
    public ProspectDataType Type { get; set; }
    public string? Value { get; set; }
}
