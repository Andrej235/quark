using System.Linq.Expressions;

namespace Quark.Services.Read.KeysetPagination;

public interface IKeysetPaginationService<TEntity>
{
    Task<PaginatedResult<TResult, KeysetCursor<TSortKey>>> GetPageAsync<TResult, TSortKey>(
        Expression<Func<TEntity, TSortKey>> orderBy,
        Expression<Func<TEntity, TResult>> select,
        Func<TResult, TSortKey> cursorSelector,
        KeysetCursor<TSortKey> cursor,
        Expression<Func<TEntity, bool>>? criteria = null,
        CancellationToken cancellationToken = default
    );
}
