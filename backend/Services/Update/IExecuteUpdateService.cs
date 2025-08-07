using System.Linq.Expressions;
using FluentResults;
using Microsoft.EntityFrameworkCore.Query;

namespace Quark.Services.Update
{
    /// <summary>
    /// Represents a generic interface for updating entities in the database without loading them into memory
    /// If you want to update entities you already have a reference to, use:
    /// <br /><see cref="IUpdateSingleService{T}.Update(T)"/> to update a single entity
    /// <br /><see cref="IUpdateRangeService{T}.Update(IEnumerable{T})"/> to update a multiple entities
    /// </summary>
    /// <typeparam name="TEntity">Data model representing the database table</typeparam>
    public interface IExecuteUpdateService<TEntity>
        where TEntity : class
    {
        /// <summary>
        /// Updates all entities which match the <paramref name="updateCriteria"/> according to <paramref name="setPropertyCalls"/>
        /// <br /> <br />
        /// If you want to update entities you have a reference to, use:
        /// <br /><see cref="IUpdateSingleService{T}.Update(T)"/> to update a single entity
        /// <br /><see cref="IUpdateRangeService{T}.Update(IEnumerable{T})"/> to update a multiple entities
        /// </summary>
        /// <param name="updateCriteria">The criteria to update</param>
        /// <param name="setPropertyCalls">The property calls to set in the database</param>
        /// <param name="validate">
        /// Whether to validate the result of the deletion
        /// If set to true, can return an error if no entities were deleted
        /// </param>
        /// <returns>
        /// A <see cref="Result"/> where: <br/>
        /// - <see cref="Result.IsSuccess"/> is `true` <br/>
        /// - <see cref="Result.IsFailed"/> is `true` with one of the following errors: <br/>
        ///   - <see cref="Errors.NotFound"/> (HTTP 404): If the no entities were updated and <paramref name="validate"/> is set to `true`
        /// </returns>
        Task<Result> Update(
            Expression<Func<TEntity, bool>> updateCriteria,
            Expression<Func<SetPropertyCalls<TEntity>, SetPropertyCalls<TEntity>>> setPropertyCalls,
            bool validate = true
        );
    }
}
