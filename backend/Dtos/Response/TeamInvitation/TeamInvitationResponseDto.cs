using Quark.Models.Enums;

namespace Quark.Dtos.Response.TeamInvitation;

public class TeamInvitationResponseDto
{
    public Guid Id { get; set; }
    public DateTime ExpiresAt { get; set; }

    public string TeamName { get; set; } = null!;
    public string? TeamLogo { get; set; }

    public string InvitedBy { get; set; } = null!;

    public TeamInvitationStatus Status { get; set; }
}
