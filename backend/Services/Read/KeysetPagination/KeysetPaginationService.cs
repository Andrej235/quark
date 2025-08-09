using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace Quark.Services.Read.KeysetPagination;

public class KeysetPaginationService<TEntity>(DbContext context) : IKeysetPaginationService<TEntity>
    where TEntity : class
{
    public async Task<PaginatedResult<TResult, KeysetCursor<TSortKey>>> GetPageAsync<
        TResult,
        TSortKey
    >(
        Expression<Func<TEntity, TSortKey>> orderBy,
        Expression<Func<TEntity, TResult>> select,
        Func<TResult, TSortKey> cursorSelector,
        KeysetCursor<TSortKey> cursor,
        Expression<Func<TEntity, bool>>? criteria = null,
        CancellationToken cancellationToken = default
    )
    {
        IQueryable<TEntity> query = context.Set<TEntity>();

        if (criteria is not null)
            query = query.Where(criteria);

        // Apply keyset filter
        if (cursor.LastKey is not null)
        {
            var param = orderBy.Parameters[0];
            var comparison = cursor.IsDescending
                ? Expression.LessThan(orderBy.Body, Expression.Constant(cursor.LastKey))
                : Expression.GreaterThan(orderBy.Body, Expression.Constant(cursor.LastKey));

            var lambda = Expression.Lambda<Func<TEntity, bool>>(comparison, param);
            query = query.Where(lambda);
        }

        query = cursor.IsDescending ? query.OrderByDescending(orderBy) : query.OrderBy(orderBy);

        // Fetch an extra item to check for more results
        var items = await query
            .Take(cursor.PageSize + 1)
            .Select(select)
            .ToListAsync(cancellationToken);

        bool hasMore = items.Count > cursor.PageSize;
        var pageItems = hasMore ? items.Take(cursor.PageSize).ToList() : items;

        TSortKey? nextKey = cursorSelector(pageItems.Last());
        var nextCursor = hasMore
            ? new KeysetCursor<TSortKey>(nextKey, cursor.PageSize, cursor.IsDescending)
            : null;

        return new PaginatedResult<TResult, KeysetCursor<TSortKey>>(pageItems, nextCursor, hasMore);
    }
}
