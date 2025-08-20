using Quark.Dtos.Response.Team;
using Quark.Models;

namespace Quark.Services.Mapping.Response.TeamMappers;

public class TeamResponseMapper : IResponseMapper<Team, TeamResponseDto>
{
    public TeamResponseDto Map(Team from) =>
        new()
        {
            Id = from.Id,
            Name = from.Name,
            Description = from.Description,
            Logo = from.Logo,
            DefaultRoleId = from.DefaultRoleId,
        };
}
