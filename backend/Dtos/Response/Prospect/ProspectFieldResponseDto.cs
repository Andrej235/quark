using Quark.Models.Enums;

namespace Quark.Dtos.Response.Prospect;

public class ProspectFieldResponseDto
{
    public string Id { get; set; } = null!;
    public ProspectDataType Type { get; set; }
    public string? Value { get; set; }
}
