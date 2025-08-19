using Quark.Dtos.Request.TeamRoles;
using Quark.Models;
using Quark.Models.Enums;

namespace Quark.Services.Mapping.Request.TeamRoleMappers;

public class CreateTeamRoleRequestMapper : IRequestMapper<CreateTeamRoleRequestDto, TeamRole>
{
    public TeamRole Map(CreateTeamRoleRequestDto from) =>
        new()
        {
            Name = from.Name,
            Description = from.Description,
            Permissions = (TeamPermission)from.Permissions,
            TeamId = from.TeamId,
        };
}
