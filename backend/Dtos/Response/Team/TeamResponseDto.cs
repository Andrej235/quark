namespace Quark.Dtos.Response.Team;

public class TeamResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public int Permissions { get; set; }
    public string RoleName { get; set; } = null!;
    public string? Description { get; set; }
}
