using Microsoft.AspNetCore.Diagnostics;

namespace Quark.Exceptions
{
    public class ExceptionHandler(ILogger<ExceptionHandler> logger) : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken
        )
        {
            logger.LogError(exception, "An error occurred: {Message}", exception.Message);
            httpContext.Response.StatusCode = 500;
            await httpContext.Response.WriteAsync(exception.Message, cancellationToken);
            return true;
        }
    }
}
