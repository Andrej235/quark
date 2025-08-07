using FluentResults;

namespace Quark.Services.Create
{
    /// <summary>
    /// Represents a generic interface for adding multiple entities to the database at once
    /// </summary>
    /// <typeparam name="TEntity">Model representing the database table</typeparam>
    public interface ICreateRangeService<in TEntity>
        where TEntity : class
    {
        /// <summary>
        /// Adds entities to database
        /// </summary>
        /// <param name="toAdd">Entities to save in the database</param>
        /// <returns>
        /// A <see cref="Result"/> where: <br/>
        /// - <see cref="Result.IsSuccess"/> is `true` <br/>
        /// - <see cref="Result.IsFailed"/> is `true` with one of the following errors: <br/>
        ///   - <see cref="Errors.BadRequest"/> (HTTP 400): If the request fails database validation (e.g., missing Name).
        /// </returns>
        Task<Result> Add(IEnumerable<TEntity> toAdd);
    }
}
