namespace Quark.Dtos.Response.User;

public class TokensResponseDto
{
    public string Jwt { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}
