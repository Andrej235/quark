using System.ComponentModel.DataAnnotations;

namespace Quark.Dtos.Request.User;

public class ResetPasswordRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string Token { get; set; } = null!;

    [Required]
    [MinLength(8)]
    public string NewPassword { get; set; } = null!;
}
