using System.Security.Claims;

namespace Quark.Services.ConnectionMapper;

public class ConnectionMapper
{
    private readonly Dictionary<string, HashSet<string>> connections = [];
    public int Count => connections.Count;

    public void Add(ClaimsPrincipal user, string connectionId)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return;

        lock (connections)
        {
            if (!connections.TryGetValue(userId, out var userConnections))
            {
                HashSet<string> @new = [connectionId];
                connections.Add(userId, @new);
                return;
            }

            lock (userConnections)
            {
                userConnections.Add(connectionId);
            }
        }
    }

    public IEnumerable<string> GetConnections(ClaimsPrincipal? user) =>
        user?.FindFirstValue(ClaimTypes.NameIdentifier) is string userId
            ? GetConnections(userId)
            : [];

    public IEnumerable<string> GetConnections(string userId)
    {
        if (connections.TryGetValue(userId, out var userConnections))
            return userConnections;

        return [];
    }

    public void Remove(ClaimsPrincipal user, string connectionId)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return;

        lock (connections)
        {
            if (!connections.TryGetValue(userId, out var userConnections))
                return;

            lock (userConnections)
            {
                userConnections.Remove(connectionId);

                if (userConnections.Count == 0)
                    connections.Remove(userId);
            }
        }
    }
}
