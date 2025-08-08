using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Quark.Models;

namespace Quark.Data;

public class DataContext(DbContextOptions<DataContext> options) : IdentityDbContext(options)
{
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<TeamMember> TeamMembers { get; set; }
    public DbSet<TeamRole> TeamRoles { get; set; }
    public DbSet<TeamInvitation> TeamInvitations { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<User>(user =>
        {
            user.HasOne(x => x.DefaultTeam)
                .WithMany()
                .HasForeignKey(x => x.DefaultTeamId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<Team>(team =>
        {
            team.HasKey(x => x.Id);

            team.HasOne(x => x.Owner).WithMany().OnDelete(DeleteBehavior.Cascade);

            team.HasIndex(x => x.Name).IsUnique();
        });

        builder.Entity<TeamMember>(teamMember =>
        {
            teamMember.HasKey(x => new { x.UserId, x.TeamId });

            teamMember
                .HasOne(x => x.User)
                .WithMany(x => x.MemberOfTeams)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            teamMember
                .HasOne(x => x.Team)
                .WithMany(x => x.Members)
                .HasForeignKey(x => x.TeamId)
                .OnDelete(DeleteBehavior.Cascade);

            teamMember
                .HasOne(x => x.Role)
                .WithMany()
                .HasForeignKey(x => x.RoleId)
                .OnDelete(DeleteBehavior.Cascade);

            teamMember.HasIndex(x => x.RoleId);
        });

        builder.Entity<TeamRole>(teamRole =>
        {
            teamRole.HasKey(x => x.Id);

            teamRole
                .HasOne(x => x.Team)
                .WithMany(x => x.Roles)
                .HasForeignKey(x => x.TeamId)
                .OnDelete(DeleteBehavior.Cascade);

            teamRole.HasIndex(x => new { x.TeamId, x.Name }).IsUnique();
        });

        builder.Entity<TeamInvitation>(teamInvitation =>
        {
            teamInvitation.HasKey(x => x.Token);

            teamInvitation
                .HasOne(x => x.Team)
                .WithMany()
                .HasForeignKey(x => x.TeamId)
                .OnDelete(DeleteBehavior.Cascade);

            teamInvitation
                .HasOne(x => x.Sender)
                .WithMany()
                .HasForeignKey(x => x.SenderId)
                .OnDelete(DeleteBehavior.NoAction);

            teamInvitation
                .HasOne(x => x.Receiver)
                .WithMany()
                .HasForeignKey(x => x.ReceiverId)
                .OnDelete(DeleteBehavior.NoAction);

            teamInvitation.HasIndex(x => x.TeamId);

            teamInvitation.HasIndex(x => new { x.ReceiverId, x.ExpiresAt });
        });

        builder.Entity<RefreshToken>(refreshToken =>
        {
            refreshToken.HasKey(x => x.Id);

            refreshToken.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);

            refreshToken.HasIndex(x => x.Token).IsUnique();

            refreshToken.HasIndex(x => new { x.UserId, x.Token });
        });
    }
}
