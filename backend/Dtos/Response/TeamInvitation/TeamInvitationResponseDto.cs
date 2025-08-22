using Quark.Models.Enums;

namespace Quark.Dtos.Response.TeamInvitation;

public class TeamInvitationResponseDto
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }

    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? UserProfilePicture { get; set; }

    public string InvitedBy { get; set; } = null!;

    public TeamInvitationStatus Status { get; set; }
}
