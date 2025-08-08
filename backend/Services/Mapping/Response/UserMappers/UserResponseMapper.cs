using Quark.Dtos.Response.User;
using Quark.Models;

namespace Quark.Services.Mapping.Response.UserMappers;

public class UserResponseMapper : IResponseMapper<User, UserResponseDto>
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
            TeamsInfo = [],
        };
}
