using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Quark.Services.Read;

namespace Quark.Services.Read
{
    public interface IWrappedResult<out TEntity>;

    public interface IWrappedQueryable<out TEntity> : IWrappedResult<TEntity>;

    public interface IWrappedIncludableQueryable<out TEntity, out TProperty>
        : IWrappedQueryable<TEntity>;

    public record WrappedQueryable<TEntity>(IQueryable<TEntity> Source)
        : IWrappedQueryable<TEntity>;

    public record WrappedIncludableQueryable<TEntity, TProperty>(
        IIncludableQueryable<TEntity, TProperty> IncludableSource
    )
        : WrappedQueryable<TEntity>(IncludableSource),
            IWrappedIncludableQueryable<TEntity, TProperty>;

    public interface IWrappedOrderedQueryable<out TEntity> : IWrappedResult<TEntity>;

    public record WrappedOrderedQueryable<TEntity>(IOrderedQueryable<TEntity> Source)
        : IWrappedOrderedQueryable<TEntity>;

    public static class WrappedQueryableExtensions
    {
        public static IWrappedQueryable<TEntity> Wrap<TEntity>(this IQueryable<TEntity> source)
            where TEntity : class => new WrappedQueryable<TEntity>(source);

        public static IWrappedQueryable<TEntity> Include<TEntity>(
            this IWrappedQueryable<TEntity> source,
            [NotParameterized] string navigationPropertyPath
        )
            where TEntity : class =>
            new WrappedQueryable<TEntity>(
                (
                    source as WrappedQueryable<TEntity> ?? throw new InvalidOperationException()
                ).Source.Include(navigationPropertyPath)
            );

        public static IWrappedIncludableQueryable<TEntity, TProperty> Include<TEntity, TProperty>(
            this IWrappedQueryable<TEntity> source,
            Expression<Func<TEntity, TProperty>> navigationPropertyPath
        )
            where TEntity : class =>
            new WrappedIncludableQueryable<TEntity, TProperty>(
                (
                    source as WrappedQueryable<TEntity> ?? throw new InvalidOperationException()
                ).Source.Include(navigationPropertyPath)
            );

        public static IWrappedIncludableQueryable<TEntity, TProperty> Include<
            TEntity,
            TProperty,
            TPreviousProperty
        >(
            this IWrappedIncludableQueryable<TEntity, TPreviousProperty> source,
            Expression<Func<TEntity, TProperty>> navigationPropertyPath
        )
            where TEntity : class =>
            new WrappedIncludableQueryable<TEntity, TProperty>(
                (
                    source as WrappedIncludableQueryable<TEntity, TPreviousProperty>
                    ?? throw new InvalidOperationException()
                ).Source.Include(navigationPropertyPath)
            );

        public static IWrappedIncludableQueryable<TEntity, TProperty> ThenInclude<
            TEntity,
            TPreviousProperty,
            TProperty
        >(
            this IWrappedIncludableQueryable<TEntity, TPreviousProperty> source,
            Expression<Func<TPreviousProperty, TProperty>> navigationPropertyPath
        )
            where TEntity : class =>
            new WrappedIncludableQueryable<TEntity, TProperty>(
                (
                    source as WrappedIncludableQueryable<TEntity, TPreviousProperty>
                    ?? throw new InvalidOperationException()
                ).IncludableSource.ThenInclude(navigationPropertyPath)
            );

        public static IWrappedIncludableQueryable<TEntity, TProperty> ThenInclude<
            TEntity,
            TPreviousProperty,
            TProperty
        >(
            this IWrappedIncludableQueryable<TEntity, IEnumerable<TPreviousProperty>> source,
            Expression<Func<TPreviousProperty, TProperty>> navigationPropertyPath
        )
            where TEntity : class =>
            new WrappedIncludableQueryable<TEntity, TProperty>(
                (
                    (
                        (
                            source
                            as WrappedIncludableQueryable<TEntity, ICollection<TPreviousProperty>>
                        )?.IncludableSource
                        ?? (
                            source
                            as WrappedIncludableQueryable<
                                TEntity,
                                IOrderedEnumerable<TPreviousProperty>
                            >
                        )?.IncludableSource
                        ?? (
                            source
                            as WrappedIncludableQueryable<TEntity, IEnumerable<TPreviousProperty>>
                        )?.IncludableSource
                        ?? (
                            source
                            as WrappedIncludableQueryable<TEntity, IQueryable<TPreviousProperty>>
                        )?.IncludableSource
                    ) ?? throw new InvalidOperationException()
                ).ThenInclude(navigationPropertyPath)
            );

        public static IWrappedOrderedQueryable<TSource> OrderBy<TSource, TKey>(
            this IWrappedQueryable<TSource> source,
            Expression<Func<TSource, TKey>> keySelector
        ) =>
            new WrappedOrderedQueryable<TSource>(
                (source as WrappedQueryable<TSource>)?.Source?.OrderBy(keySelector)
                    ?? throw new InvalidOperationException()
            );

        public static IWrappedOrderedQueryable<TSource> OrderByDescending<TSource, TKey>(
            this IWrappedQueryable<TSource> source,
            Expression<Func<TSource, TKey>> keySelector
        ) =>
            new WrappedOrderedQueryable<TSource>(
                (source as WrappedQueryable<TSource>)?.Source?.OrderByDescending(keySelector)
                    ?? throw new InvalidOperationException()
            );

        public static IWrappedQueryable<TEntity> AsNoTracking<TEntity>(
            this IWrappedQueryable<TEntity> source
        )
            where TEntity : class =>
            new WrappedQueryable<TEntity>(
                (source as WrappedQueryable<TEntity>)?.Source?.AsNoTracking()
                    ?? throw new InvalidOperationException()
            );
    }
}
