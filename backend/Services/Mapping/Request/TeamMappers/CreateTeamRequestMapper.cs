using Quark.Dtos.Request.Team;
using Quark.Models;
using Quark.Utilities;

namespace Quark.Services.Mapping.Request.TeamMappers;

public class CreateTeamRequestMapper : IRequestMapper<CreateTeamRequestDto, Team>
{
    public Team Map(CreateTeamRequestDto from) =>
        new()
        {
            Name = from.Name,
            Description = from.Name,
            Logo = from.Logo,
            Members = [],
            Roles = DefaultTeamRoles.GetDefaultTeamRoles(),
        };
}
