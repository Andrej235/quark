using System.ComponentModel.DataAnnotations;

namespace Quark.Dtos.Request.User;

public class LoginRequestDto
{
    [Required]
    [MinLength(3)]
    public string UsernameOrEmail { get; set; } = null!;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = null!;

    public bool UseCookies { get; set; }
}
