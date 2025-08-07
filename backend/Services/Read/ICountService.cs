using System.Linq.Expressions;
using FluentResults;

namespace Quark.Services.Read;

/// <summary>
/// Represents a generic interface for counting entities
/// </summary>
/// <typeparam name="TEntity">Data model representing the database table</typeparam>
public interface ICountService<TEntity>
    where TEntity : class
{
    /// <summary>
    /// Counts the number of entities that match a given criteria
    /// </summary>
    /// <param name="criteria">
    /// Expression used to find entities
    /// <br />If set to null, no search query will be applied, i.e. all entities will be counted
    /// </param>
    /// <param name="cancellationToken">Cancellation token passed to Entity Framework's underlying query</param>
    /// <returns>
    /// A <see cref="Result{TValue}"/> where: <br/>
    /// - <see cref="Result{TValue}.IsSuccess"/> is `true` and <see cref="Result{TValue}.Value"/> contains all entities that fit the <paramref name="criteria"/> mapped according to <paramref name="select"/>
    /// </returns>
    Task<Result<int>> Count(
        Expression<Func<TEntity, bool>>? criteria,
        CancellationToken cancellationToken = default
    );
}
