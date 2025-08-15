using Microsoft.Extensions.Caching.Memory;
using Quark.Models;
using Quark.Models.Enums;
using Quark.Services.Read;
using Quark.Utilities;

namespace Quark.Services.TeamPermissions;

public class TeamPermissionsService(
    IReadSingleSelectedService<TeamMember> readService,
    IMemoryCache cache
) : ITeamPermissionsService
{
    public async Task<bool> HasPermission(string userId, Guid teamId, TeamPermission permission)
    {
        var cacheKey = CacheKeys.TeamPermission(userId, teamId);

        if (cache.TryGetValue(cacheKey, out TeamPermission permissions))
            return permissions.HasFlag(permission);

        var permissionsResult = await readService.Get(
            x => x.Role.Permissions,
            x => x.UserId == userId && x.TeamId == teamId
        );

        if (permissionsResult.IsFailed)
        {
            cache.Set(
                cacheKey,
                0,
                new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
                    SlidingExpiration = TimeSpan.FromMinutes(2),
                }
            );

            return false;
        }

        permissions = permissionsResult.Value;
        cache.Set(
            cacheKey,
            permissions,
            new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
                SlidingExpiration = TimeSpan.FromMinutes(2),
            }
        );

        return permissions.HasFlag(permission);
    }
}
