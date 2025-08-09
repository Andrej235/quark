namespace Quark.Dtos.Response;

public class PaginatedResponseDto<T>
{
    public IEnumerable<T> Items { get; set; } = [];
    public bool HasMore { get; set; }
    public string? CursorToken { get; set; } = null!;
}
