using Quark.Dtos.Response.Team;

namespace Quark.Dtos.Response.User;

public class UserResponseDto
{
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? ProfilePicture { get; set; }
    public bool IsEmailVerified { get; set; }
    public List<TeamResponseDto> TeamsInfo { get; set; } = [];
}
