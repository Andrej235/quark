using System.Linq.Expressions;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using Quark.Data;
using Quark.Errors;
using Quark.Utilities;

namespace Quark.Services.Read
{
    public class ReadService<TEntity>(DataContext context)
        : IReadSingleService<TEntity>,
            IReadRangeService<TEntity>,
            IReadSingleSelectedService<TEntity>,
            IReadRangeSelectedService<TEntity>,
            ICountService<TEntity>
        where TEntity : class
    {
        public async Task<Result<TEntity>> Get(
            Expression<Func<TEntity, bool>> criteria,
            Func<IWrappedQueryable<TEntity>, IWrappedResult<TEntity>>? queryBuilder = null,
            CancellationToken cancellationToken = default
        )
        {
            IQueryable<TEntity>? source = queryBuilder is null
                ? context.Set<TEntity>()
                : Unwrap(queryBuilder.Invoke(context.Set<TEntity>().Wrap()));

            if (source is null)
                return Result.Fail(new InternalError("Failed to unwrap query"));

            var result = await source.FirstOrDefaultAsync(
                criteria,
                cancellationToken: cancellationToken
            );
            return result is null ? Result.Fail(new NotFound("Entity not found")) : result;
        }

        public async Task<Result<T>> Get<T>(
            Expression<Func<TEntity, T>> select,
            Expression<Func<TEntity, bool>> criteria,
            Func<IWrappedQueryable<TEntity>, IWrappedResult<TEntity>>? queryBuilder = null,
            CancellationToken cancellationToken = default
        )
        {
            IQueryable<TEntity>? source = queryBuilder is null
                ? context.Set<TEntity>()
                : Unwrap(queryBuilder.Invoke(context.Set<TEntity>().Wrap()));

            if (source is null)
                return Result.Fail(new InternalError("Failed to unwrap query"));

            var result = await source
                .Where(criteria)
                .Select(select)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);
            return result is null ? Result.Fail(new NotFound("Entity not found")) : result;
        }

        public async Task<Result<IEnumerable<TEntity>>> Get(
            Expression<Func<TEntity, bool>>? criteria,
            int? offset = 0,
            int? limit = -1,
            Func<IWrappedQueryable<TEntity>, IWrappedResult<TEntity>>? queryBuilder = null,
            CancellationToken cancellationToken = default
        )
        {
            if (queryBuilder is null)
                return criteria is null
                    ? await context
                        .Set<TEntity>()
                        .ApplyOffsetAndLimit(offset, limit, cancellationToken: cancellationToken)
                    : await context
                        .Set<TEntity>()
                        .Where(criteria)
                        .ApplyOffsetAndLimit(offset, limit, cancellationToken: cancellationToken);

            IWrappedResult<TEntity> includeResult = queryBuilder.Invoke(
                context.Set<TEntity>().Wrap()
            );
            IQueryable<TEntity>? source = Unwrap(includeResult);

            if (source is null)
                return Result.Fail(new InternalError("Failed to unwrap query"));

            return criteria is null
                ? await source.ApplyOffsetAndLimit(
                    offset,
                    limit,
                    cancellationToken: cancellationToken
                )
                : await source
                    .Where(criteria)
                    .ApplyOffsetAndLimit(offset, limit, cancellationToken: cancellationToken);
        }

        public async Task<Result<IEnumerable<T>>> Get<T>(
            Expression<Func<TEntity, T>> select,
            Expression<Func<TEntity, bool>>? criteria,
            int? offset = 0,
            int? limit = -1,
            Func<IWrappedQueryable<TEntity>, IWrappedResult<TEntity>>? queryBuilder = null,
            CancellationToken cancellationToken = default
        )
        {
            if (queryBuilder is null)
                return criteria is null
                    ? await context
                        .Set<TEntity>()
                        .Select(select)
                        .ApplyOffsetAndLimit(offset, limit, cancellationToken: cancellationToken)
                    : await context
                        .Set<TEntity>()
                        .Where(criteria)
                        .Select(select)
                        .ApplyOffsetAndLimit(offset, limit, cancellationToken: cancellationToken);

            IWrappedResult<TEntity> query = queryBuilder.Invoke(context.Set<TEntity>().Wrap());
            IQueryable<TEntity>? source = Unwrap(query);

            if (source is null)
                return Result.Fail(new InternalError("Failed to unwrap query"));

            return criteria is null
                ? await source
                    .Select(select)
                    .ApplyOffsetAndLimit(offset, limit, cancellationToken: cancellationToken)
                : await source
                    .Where(criteria)
                    .Select(select)
                    .ApplyOffsetAndLimit(offset, limit, cancellationToken: cancellationToken);
        }

        private static IQueryable<TEntity>? Unwrap(IWrappedResult<TEntity> source) =>
            (source as WrappedQueryable<TEntity>)?.Source
            ?? (source as WrappedOrderedQueryable<TEntity>)?.Source
            ?? null;

        public async Task<Result<int>> Count(
            Expression<Func<TEntity, bool>>? criteria,
            CancellationToken cancellationToken = default
        ) =>
            criteria is null
                ? await context.Set<TEntity>().CountAsync(cancellationToken: cancellationToken)
                : await context
                    .Set<TEntity>()
                    .Where(criteria)
                    .CountAsync(cancellationToken: cancellationToken);
    }
}
