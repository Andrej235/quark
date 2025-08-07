using System.Linq.Expressions;
using FluentResults;

namespace Quark.Services.Delete
{
    /// <summary>
    /// Represents a generic interface for deleting entities from the database
    /// </summary>
    /// <typeparam name="TEntity">Data model representing the database table</typeparam>
    public interface IDeleteService<TEntity>
        where TEntity : class
    {
        /// <summary>
        /// Deletes all entities that match the delete criteria
        /// </summary>
        /// <param name="deleteCriteria">Criteria to match</param>
        /// <param name="validate">
        /// Whether to validate the result of the deletion
        /// If set to true, can return an error if no entities were deleted
        /// </param>
        /// <returns>
        /// A <see cref="Result"/> where: <br/>
        /// - <see cref="Result.IsSuccess"/> is `true` <br/>
        /// - <see cref="Result.IsFailed"/> is `true` with one of the following errors: <br/>
        ///   - <see cref="Errors.NotFound"/> (HTTP 404): If the no entities were deleted and <paramref name="validate"/> is set to `true`
        /// </returns>
        Task<Result> Delete(Expression<Func<TEntity, bool>> deleteCriteria, bool validate = true);
    }
}
