namespace Quark.Dtos.Request.Team;

public class CreateTeamRequestDto
{
    public string Name { get; set; } = null!;
    public string? Logo { get; set; }
    public string? Description { get; set; }
}
