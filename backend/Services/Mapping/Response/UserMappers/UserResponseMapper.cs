using Quark.Dtos.Response.Team;
using Quark.Dtos.Response.User;
using Quark.Models;

namespace Quark.Services.Mapping.Response.UserMappers;

public class UserResponseMapper(IResponseMapper<Team, TeamResponseDto> teamResponseMapper)
    : IResponseMapper<User, UserResponseDto>
{
    public UserResponseDto Map(User from) =>
        new()
        {
            Email = from.Email!,
            FirstName = from.FirstName,
            LastName = from.LastName,
            ProfilePicture = from.ProfilePicture,
            Username = from.UserName!,
            IsEmailVerified = from.EmailConfirmed,
            TeamsInfo = from.MemberOfTeams.Select(x =>
            {
                var mapped = teamResponseMapper.Map(x.Team);
                mapped.RoleName = x.Role.Name;
                mapped.Permissions = (int)x.Role.Permissions;
                return mapped;
            }),
        };
}
