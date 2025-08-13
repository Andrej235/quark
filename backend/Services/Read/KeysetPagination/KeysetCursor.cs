namespace Quark.Services.Read.KeysetPagination;

public record KeysetCursor<TSortKey>(TSortKey? LastKey, int PageSize, bool IsDescending = false);
