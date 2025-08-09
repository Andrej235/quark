using System.Text;
using System.Text.Json;
using System.Web;
using Quark.Services.Read.KeysetPagination;

namespace Quark.Utilities;

public static class PaginationCursorExtensions
{
    private static readonly JsonSerializerOptions options = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false,
    };

    public static KeysetCursor<string?>? ToKeysetCursor(this string? token)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(token))
                return null;

            var base64 = HttpUtility.UrlDecode(token);
            var bytes = Convert.FromBase64String(base64);
            var json = Encoding.UTF8.GetString(bytes);
            return JsonSerializer.Deserialize<KeysetCursor<string?>>(json, options);
        }
        catch
        {
            return null;
        }
    }

    public static KeysetCursor<T>? ToKeysetCursor<T>(this string? token)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(token))
                return null;

            var base64 = HttpUtility.UrlDecode(token);
            var bytes = Convert.FromBase64String(base64);
            var json = Encoding.UTF8.GetString(bytes);
            return JsonSerializer.Deserialize<KeysetCursor<T>>(json, options);
        }
        catch
        {
            return null;
        }
    }

    public static string? ToToken(this KeysetCursor<string?> cursor) =>
        cursor == null
            ? null
            : HttpUtility.UrlEncode(
                Convert.ToBase64String(
                    Encoding.UTF8.GetBytes(JsonSerializer.Serialize(cursor, options))
                )
            );
}
