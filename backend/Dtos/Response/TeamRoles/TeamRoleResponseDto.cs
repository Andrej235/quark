namespace Quark.Dtos.Response.TeamRoles;

public class TeamRoleResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;

    public Guid TeamId { get; set; }
    public int Permissions { get; set; }

    public int UserCount { get; set; }
}
