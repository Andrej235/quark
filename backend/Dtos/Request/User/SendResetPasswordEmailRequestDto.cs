using System.ComponentModel.DataAnnotations;

namespace Quark.Dtos.Request.User;

public class SendResetPasswordEmailRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;
}
