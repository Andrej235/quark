namespace Quark.Dtos.Request.Team;

public class ChangeMemberRoleRequestDto
{
    public string UserName { get; set; } = null!;
    public Guid RoleId { get; set; }
}
