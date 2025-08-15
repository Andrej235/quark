namespace Quark.Utilities;

public static class CacheKeys
{
    public static string TeamPermission(string userId, Guid teamId) =>
        $"TeamPermission:{userId}:{teamId}";
}
