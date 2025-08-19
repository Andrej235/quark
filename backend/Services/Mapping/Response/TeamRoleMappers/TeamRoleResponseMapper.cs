using Quark.Dtos.Response.TeamRoles;
using Quark.Models;

namespace Quark.Services.Mapping.Response.TeamRoleMappers;

public class TeamRoleResponseMapper : IResponseMapper<TeamRole, TeamRoleResponseDto>
{
    public TeamRoleResponseDto Map(TeamRole from) =>
        new()
        {
            Id = from.Id,
            Name = from.Name,
            Description = from.Description,
            Permissions = (int)from.Permissions,
            TeamId = from.TeamId,
        };
}
