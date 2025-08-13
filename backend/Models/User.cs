using Microsoft.AspNetCore.Identity;

namespace Quark.Models;

public class User : IdentityUser
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? ProfilePicture { get; set; }

    public Guid? DefaultTeamId { get; set; } = null;
    public Team? DefaultTeam { get; set; } = null;

    public ICollection<TeamMember> MemberOfTeams { get; set; } = [];
    public ICollection<TeamInvitation> Invitations { get; set; } = [];
}
