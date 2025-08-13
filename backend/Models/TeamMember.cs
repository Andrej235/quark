namespace Quark.Models;

public class TeamMember
{
    public string UserId { get; set; } = null!;
    public User User { get; set; } = null!;

    public Guid TeamId { get; set; }
    public Team Team { get; set; } = null!;

    public Guid RoleId { get; set; }
    public TeamRole Role { get; set; } = null!;

    public DateTime JoinedAt { get; set; }
}
