namespace Quark.Models;

public class RefreshToken
{
    public Guid Id { get; set; }
    public string Token { get; set; } = null!;
    public DateTime IssuedUtc { get; set; }
    public DateTime ExpiresUtc { get; set; }

    public string UserId { get; set; } = null!;
    public User User { get; set; } = null!;
}
