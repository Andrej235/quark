using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Quark.Models;

namespace Quark.Data;

public class DataContext(DbContextOptions<DataContext> options) : IdentityDbContext(options)
{
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<RefreshToken>(refreshToken =>
        {
            refreshToken.HasKey(x => x.Id);

            refreshToken.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);

            refreshToken.HasIndex(x => x.Token).IsUnique();

            refreshToken.HasIndex(x => new { x.UserId, x.Token });
        });
    }
}
