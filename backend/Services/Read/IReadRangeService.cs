using System.Linq.Expressions;
using FluentResults;

namespace Quark.Services.Read
{
    /// <summary>
    /// Represents a generic interface for getting multiple entities from the database
    /// </summary>
    /// <typeparam name="TEntity">Data model representing the database table</typeparam>
    public interface IReadRangeService<TEntity>
        where TEntity : class
    {
        /// <summary>
        /// Finds all entities in database which fit the <paramref name="criteria"/>
        /// </summary>
        /// <param name="criteria">
        /// Expression used to find entities
        /// <br />If the value is null, no search query will be applied, i.e. all entities will be returned according to <paramref name="offset"/> and <paramref name="limit"/>
        /// </param>
        /// <param name="offset">
        /// Number of entities which will be skipped when creating the output list
        /// <br/>If the value is 0, no entities will be skipped
        /// <br/>If the value is null, no entities will be skipped
        /// </param>
        /// <param name="limit">
        /// Maximum number of entities which will be included in the output list
        /// <br/>If a negative value is entered, output will include all entities which fit the criteria
        /// <br/>If the value is null, output will include all entities which fit the criteria
        /// </param>
        /// <param name="queryBuilder">
        /// Used to further modify the query
        /// It allows 5 methods: Include, ThenInclude, OrderBy, OrderByDescending and AsNoTracking
        /// </param>
        /// <param name="cancellationToken">Cancellation token passed to Entity Framework's underlying query</param>
        /// <returns>
        /// A <see cref="Result{TValue}"/> where: <br/>
        /// - <see cref="Result{TValue}.IsSuccess"/> is `true` and <see cref="Result{TValue}.Value"/> contains all entities that fit the <paramref name="criteria"/> in form of an <see cref="IEnumerable{T}"/> <br/>
        /// - <see cref="Result{TValue}.IsFailed"/> is `true` with one of the following errors: <br/>
        ///   - <see cref="Errors.InternalError"/> (HTTP 500): If the server fails to unwrap the query created by <paramref name="queryBuilder"/>
        /// </returns>
        Task<Result<IEnumerable<TEntity>>> Get(
            Expression<Func<TEntity, bool>>? criteria,
            int? offset = 0,
            int? limit = -1,
            Func<IWrappedQueryable<TEntity>, IWrappedResult<TEntity>>? queryBuilder = null,
            CancellationToken cancellationToken = default
        );
    }
}
