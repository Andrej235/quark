using System.Linq.Expressions;
using FluentResults;

namespace Quark.Services.Read
{
    /// <summary>
    /// Represents a generic interface for getting a single entity from the database
    /// </summary>
    /// <typeparam name="TEntity">Data model representing the database table</typeparam>
    public interface IReadSingleService<TEntity>
        where TEntity : class
    {
        /// <summary>
        /// Finds the first entity in database which fits the <paramref name="criteria"/>
        /// </summary>
        /// <param name="criteria">Expression used to find the entity</param>
        /// <param name="queryBuilder">
        /// Used to further modify the query
        /// Allows 5 methods: Include, ThenInclude, OrderBy, OrderByDescending and AsNoTracking
        /// </param>
        /// <param name="cancellationToken">Cancellation token passed to Entity Framework's underlying query</param>
        /// <returns>
        /// A <see cref="Result{TValue}"/> where: <br/>
        /// - <see cref="Result{TValue}.IsSuccess"/> is `true` and <see cref="Result{TValue}.Value"/> contains the first entity that fits the <paramref name="criteria"/> <br/>
        /// - <see cref="Result{TValue}.IsFailed"/> is `true` with one of the following errors: <br/>
        ///   - <see cref="Errors.NotFound"/> (HTTP 404): If the requested entity was not found
        ///   - <see cref="Errors.InternalError"/> (HTTP 500): If the server fails to unwrap the query created by <paramref name="queryBuilder"/>
        /// </returns>
        Task<Result<TEntity>> Get(
            Expression<Func<TEntity, bool>> criteria,
            Func<IWrappedQueryable<TEntity>, IWrappedResult<TEntity>>? queryBuilder = null,
            CancellationToken cancellationToken = default
        );
    }
}
