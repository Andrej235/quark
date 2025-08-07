using FluentResults;

namespace Quark.Services.Update
{
    /// <summary>
    /// Represents a generic interface for updating an entity to which you have a reference to in the database
    /// <br />To update multiple entities, use <see cref="IUpdateSingleService{T}.Update(T)"/>
    /// <br />To update entities without having references to them, use <see cref="IExecuteUpdateService{T}.Update"/>
    /// </summary>
    /// <typeparam name="TEntity">Data model representing the database table</typeparam>
    public interface IUpdateSingleService<in TEntity>
        where TEntity : class
    {
        /// <summary>
        /// Updates the provided entity in the database
        /// <br />The provided entity MUST be of type <typeparamref name="TEntity"/> and have the same primary key as the entity in the database
        /// <br /> <br />
        /// If you want to update an entity without having a reference to it, use <see cref="IExecuteUpdateService{T}.Update"/>
        /// </summary>
        /// <param name="updatedEntity">Entity to update</param>
        /// <returns>
        /// A <see cref="Result"/> where: <br/>
        /// - <see cref="Result.IsSuccess"/> is `true` <br/>
        /// - <see cref="Result.IsFailed"/> is `true` with one of the following errors: <br/>
        ///   - <see cref="Errors.BadRequest"/> (HTTP 400): If the updated entity fails database validation (e.g., missing Name).
        /// </returns>
        Task<Result> Update(TEntity updatedEntity);
    }
}
