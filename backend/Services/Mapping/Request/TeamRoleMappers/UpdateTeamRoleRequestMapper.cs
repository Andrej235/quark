using Quark.Dtos.Request.TeamRoles;
using Quark.Models;
using Quark.Models.Enums;

namespace Quark.Services.Mapping.Request.TeamRoleMappers;

public class UpdateTeamRoleRequestMapper : IRequestMapper<UpdateTeamRoleRequestDto, TeamRole>
{
    public TeamRole Map(UpdateTeamRoleRequestDto from) =>
        new()
        {
            Id = from.Id,
            Name = from.Name,
            Description = from.Description,
            Permissions = (TeamPermission)from.Permissions,
            TeamId = from.TeamId,
        };
}
