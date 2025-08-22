namespace Quark.Dtos.Response.Team;

public class TeamResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Logo { get; set; } = null!;
    public string? Description { get; set; }
    public int Permissions { get; set; }
    public string RoleName { get; set; } = null!;
    public Guid? DefaultRoleId { get; set; }
}
