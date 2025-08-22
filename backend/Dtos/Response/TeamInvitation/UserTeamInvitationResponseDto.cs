using Quark.Models.Enums;

namespace Quark.Dtos.Response.TeamInvitation;

public class UserTeamInvitationResponseDto
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }

    public string TeamName { get; set; } = null!;
    public string? TeamLogo { get; set; }

    public string InvitedBy { get; set; } = null!;

    public TeamInvitationStatus Status { get; set; }
}
