using Quark.Models.Enums;

namespace Quark.Models;

public class TeamRole
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;

    public Guid TeamId { get; set; }
    public Team Team { get; set; } = null!;

    public TeamPermission Permissions { get; set; }

    public ICollection<TeamMember> Members { get; set; } = [];
}
