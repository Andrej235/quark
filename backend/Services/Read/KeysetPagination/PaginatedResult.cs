namespace Quark.Services.Read.KeysetPagination;

public record PaginatedResult<T, TCursor>(
    IReadOnlyList<T> Items,
    TCursor? NextCursor,
    bool HasMore
);
