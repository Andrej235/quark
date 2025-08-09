using System.Linq.Expressions;

namespace Quark.Services.Read.KeysetPagination;

/// <summary>
/// Represents a generic interface for getting multiple mapped entities from the database using keyset pagination
/// </summary>
/// <typeparam name="TEntity">Data model representing the database table</typeparam>
public interface IKeysetPaginationService<TEntity>
{
    /// <summary>
    /// Gets a page of data from the database using keyset pagination.
    /// </summary>
    /// <typeparam name="TResult">The type of the result.</typeparam>
    /// <typeparam name="TSortKey">The type of the cursor.</typeparam>
    /// <param name="orderBy">The order by expression</param>
    /// <param name="select">Expression used to map the entities to <typeparamref name="TResult"/> on database level</param>
    /// <param name="cursorSelector">The cursor selector</param>
    /// <param name="cursor">The cursor pointing to this page</param>
    /// <param name="criteria">
    /// Expression used to find entities
    /// <br />If the value is null, no search query will be applied, i.e. all entities will be involved in pagination
    /// </param>
    /// <param name="cancellationToken">Cancellation token passed to Entity Framework's underlying query</param>
    /// <returns>An object representing a page and next page's cursor</returns>
    Task<PaginatedResult<TResult, KeysetCursor<TSortKey>>> GetPage<TResult, TSortKey>(
        Expression<Func<TEntity, TSortKey>> orderBy,
        Expression<Func<TEntity, TResult>> select,
        Func<TResult, TSortKey> cursorSelector,
        KeysetCursor<TSortKey> cursor,
        Expression<Func<TEntity, bool>>? criteria = null,
        CancellationToken cancellationToken = default
    );
}
