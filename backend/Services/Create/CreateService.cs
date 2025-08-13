using FluentResults;
using Quark.Data;
using Quark.Errors;

namespace Quark.Services.Create
{
    public class CreateService<T>(DataContext context, ILogger<CreateService<T>> logger)
        : ICreateSingleService<T>,
            ICreateRangeService<T>
        where T : class
    {
        public async Task<Result<T>> Add(T toAdd)
        {
            try
            {
                _ = await context.Set<T>().AddAsync(toAdd);
                _ = await context.SaveChangesAsync();

                return toAdd;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to create entity");
                return Result.Fail(new BadRequest("Failed to create entity"));
            }
        }

        public async Task<Result> Add(IEnumerable<T> toAdd)
        {
            try
            {
                await context.Set<T>().AddRangeAsync(toAdd);
                _ = await context.SaveChangesAsync();
                return Result.Ok();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to create entity");
                return Result.Fail(new BadRequest("Failed to create entity"));
            }
        }
    }
}
