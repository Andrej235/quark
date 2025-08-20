namespace Quark.Dtos.Response.Team;

public class TeamMemberResponseDto
{
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? ProfilePicture { get; set; }
    public string RoleName { get; set; } = null!;
    public DateTime JoinedAt { get; set; }
}
