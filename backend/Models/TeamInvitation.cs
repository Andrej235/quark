using Quark.Models.Enums;

namespace Quark.Models;

public class TeamInvitation
{
    public string Token { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public TeamInvitationStatus Status { get; set; }

    public Guid TeamId { get; set; }
    public Team Team { get; set; } = null!;

    public string SenderId { get; set; } = null!;
    public User Sender { get; set; } = null!;

    public string ReceiverId { get; set; } = null!;
    public User Receiver { get; set; } = null!;
}
