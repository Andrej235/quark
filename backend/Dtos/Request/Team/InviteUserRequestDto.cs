namespace Quark.Dtos.Request.Team;

public class InviteUserRequestDto
{
    public string Email { get; set; } = null!;
    public Guid TeamId { get; set; }
}
