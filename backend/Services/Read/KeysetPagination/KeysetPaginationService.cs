using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Quark.Data;

namespace Quark.Services.Read.KeysetPagination;

public class KeysetPaginationService<TEntity>(DataContext context)
    : IKeysetPaginationService<TEntity>
    where TEntity : class
{
    public async Task<PaginatedResult<TResult, KeysetCursor<TSortKey>>> GetPage<TResult, TSortKey>(
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
            var predicate = BuildKeysetPredicate(orderBy, cursor.LastKey, cursor.IsDescending);
            query = query.Where(predicate);
        }

        query = cursor.IsDescending ? query.OrderByDescending(orderBy) : query.OrderBy(orderBy);

        // Fetch an extra item to check for more results
        var items = await query
            .Take(cursor.PageSize + 1)
            .Select(select)
            .ToListAsync(cancellationToken);

        bool hasMore = items.Count > cursor.PageSize;
        var pageItems = hasMore ? [.. items.Take(cursor.PageSize)] : items;

        var lastElement = pageItems.LastOrDefault();
        TSortKey? nextKey = lastElement is null ? default : cursorSelector(lastElement);
        var nextCursor = hasMore
            ? new KeysetCursor<TSortKey>(nextKey, cursor.PageSize, cursor.IsDescending)
            : null;

        return new PaginatedResult<TResult, KeysetCursor<TSortKey>>(pageItems, nextCursor, hasMore);
    }

    private static Expression<Func<TEntity, bool>> BuildKeysetPredicate<TSortKey>(
        Expression<Func<TEntity, TSortKey>> orderBy,
        TSortKey lastKey,
        bool isDescending
    )
    {
        var param = orderBy.Parameters[0];

        // Comparer<T>.Default.Compare(orderBy, lastKey)
        var compareMethod = typeof(Comparer<TSortKey>).GetMethod(
            nameof(Comparer<TSortKey>.Compare),
            [typeof(TSortKey), typeof(TSortKey)]
        );

        var compareCall = Expression.Call(
            Expression.Property(
                null,
                typeof(Comparer<TSortKey>),
                nameof(Comparer<TSortKey>.Default)
            ),
            compareMethod!,
            orderBy.Body,
            Expression.Constant(lastKey, typeof(TSortKey))
        );

        // isDescending ? compare < 0 : compare > 0
        var comparison = isDescending
            ? Expression.LessThan(compareCall, Expression.Constant(0))
            : Expression.GreaterThan(compareCall, Expression.Constant(0));

        return Expression.Lambda<Func<TEntity, bool>>(comparison, param);
    }
}
