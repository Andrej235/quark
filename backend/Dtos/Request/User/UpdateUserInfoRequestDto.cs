using System.ComponentModel.DataAnnotations;

namespace Quark.Dtos.Request.User;

public class UpdateUserInfoRequestDto
{
    [Required]
    [MinLength(3)]
    public string Username { get; set; } = null!;

    [Required]
    [MinLength(1)]
    public string FirstName { get; set; } = null!;

    [Required]
    [MinLength(1)]
    public string LastName { get; set; } = null!;
}
