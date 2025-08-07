using System.ComponentModel.DataAnnotations;

namespace Quark.Dtos.Request.User;

public class RegisterRequestDto
{
    [Required]
    [MinLength(3)]
    public string Username { get; set; } = null!;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = null!;
}
