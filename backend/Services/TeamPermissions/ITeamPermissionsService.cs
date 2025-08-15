using Quark.Models.Enums;

namespace Quark.Services.TeamPermissions;

public interface ITeamPermissionsService
{
    Task<bool> HasPermission(string userId, Guid teamId, TeamPermission permission);
}
