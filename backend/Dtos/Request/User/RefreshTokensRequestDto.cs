namespace Quark.Dtos.Request.User;

public class RefreshTokensRequestDto
{
    public string Jwt { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}
