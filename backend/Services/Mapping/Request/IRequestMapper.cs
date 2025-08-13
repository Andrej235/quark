namespace Quark.Services.Mapping.Request
{
    /// <summary>
    /// Represents a generic interface for mapping from a DTO to a domain model
    /// <br/>Opposite of <see cref="Response.IResponseMapper{TFrom, TTo}"/>
    /// </summary>
    /// <typeparam name="TFrom">The type of the DTO</typeparam>
    /// <typeparam name="TTo">The type of the domain model</typeparam>
    public interface IRequestMapper<in TFrom, out TTo>
    {
        /// <summary>
        /// Maps a DTO to a domain model
        /// </summary>
        /// <param name="from">The DTO to map</param>
        /// <returns>The mapped domain model</returns>
        TTo Map(TFrom from);
    }
}
