using FluentResults;

namespace Quark.Services.Create
{
    /// <summary>
    /// Represents a generic interface for adding a single entity to the database
    /// </summary>
    /// <typeparam name="TEntity">Model representing the database table</typeparam>
    public interface ICreateSingleService<TEntity>
        where TEntity : class
    {
        /// <summary>
        /// Adds entity to database
        /// </summary>
        /// <param name="toAdd">Entity to save in the database</param>
        /// <returns>
        /// A <see cref="Result{TValue}"/> where: <br/>
        /// - <see cref="Result{TValue}.IsSuccess"/> is `true` and <see cref="Result{TValue}.Value"/> contains the added entity with its new primary key. <br/>
        /// - <see cref="Result{TValue}.IsFailed"/> is `true` with one of the following errors: <br/>
        ///   - <see cref="Errors.BadRequest"/> (HTTP 400): If the request fails database validation (e.g., missing Name).
        /// </returns>
        Task<Result<TEntity>> Add(TEntity toAdd);
    }
}
