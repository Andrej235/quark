namespace Quark.Dtos.Request.TeamRoles;

public class UpdateTeamRoleRequestDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;

    public Guid TeamId { get; set; }
    public int Permissions { get; set; }
}
