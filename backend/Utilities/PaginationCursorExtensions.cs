using System.Text;
using System.Text.Json;
using System.Web;
using Quark.Dtos.Response;
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

    public static string? ToToken<T>(this KeysetCursor<T>? cursor) =>
        cursor == null
            ? null
            : HttpUtility.UrlEncode(
                Convert.ToBase64String(
                    Encoding.UTF8.GetBytes(JsonSerializer.Serialize(cursor, options))
                )
            );

    public static PaginatedResponseDto<TResult> ToResponseDto<TResult, TKey>(
        this PaginatedResult<TResult, KeysetCursor<TKey>> paginatedResult
    ) =>
        new()
        {
            Items = paginatedResult.Items,
            CursorToken = paginatedResult.NextCursor.ToToken(),
            HasMore = paginatedResult.HasMore,
        };
}
