namespace Quark.Services.Mapping.Response
{
    /// <summary>
    /// Represents a generic interface for mapping from a domain model to a DTO
    /// <br/>Opposite of <see cref="Request.IRequestMapper{TFrom, TTo}"/>
    /// </summary>
    /// <typeparam name="TFrom">The type of the domain model</typeparam>
    /// <typeparam name="TTo">The type of the DTO</typeparam>
    public interface IResponseMapper<in TFrom, out TTo>
    {
        /// <summary>
        /// Maps a DTO to a domain model
        /// </summary>
        /// <param name="from">The domain model to map</param>
        /// <returns>The mapped DTO</returns>
        TTo Map(TFrom from);
    }
}
