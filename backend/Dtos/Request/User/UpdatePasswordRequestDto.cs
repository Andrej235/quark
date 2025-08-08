using System.ComponentModel.DataAnnotations;

namespace Quark.Dtos.Request.User;

public class UpdatePasswordRequestDto
{
    [MinLength(8)]
    public string OldPassword { get; set; } = null!;

    [MinLength(8)]
    public string NewPassword { get; set; } = null!;
}
