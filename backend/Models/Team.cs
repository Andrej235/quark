namespace Quark.Models;

public class Team
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Logo { get; set; }

    public string OwnerId { get; set; } = null!;
    public User Owner { get; set; } = null!;

    public ICollection<TeamMember> Members { get; set; } = [];
    public ICollection<TeamRole> Roles { get; set; } = [];

    public Guid DefaultProspectLayoutId { get; set; }
    public ProspectLayout DefaultProspectLayout { get; set; } = null!;

    public ICollection<Prospect> Prospects { get; set; } = [];
}
