using System.ComponentModel.DataAnnotations;

namespace Quark.Dtos.Request.User;

public class ConfirmEmailRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Token { get; set; } = string.Empty;
}
