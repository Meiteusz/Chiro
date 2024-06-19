using Chiro.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chiro.Infra
{
    public class ProjectContext : DbContext
    {
        public ProjectContext()
        {
        }

        public ProjectContext(DbContextOptions<ProjectContext> options)
            : base(options)
        { }

        public DbSet<BoardAction> BoardActions { get; set; }
        public DbSet<Domain.Entities.Project> Projects { get; set; }
        public DbSet<AuthenticationToken> AuthenticationTokens { get; set; }
        public DbSet<BoardActionLink> BoardActionLinks { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
                optionsBuilder.UseNpgsql(Environment.GetEnvironmentVariable("CONNECTION_STRING"));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BoardActionLink>()
                .HasKey(bal => new { bal.BaseBoardActionId, bal.LinkedBoardActionId });

            modelBuilder.Entity<BoardActionLink>()
                .HasOne(bal => bal.BaseBoardAction)
                .WithMany(ba => ba.BoardActionLinks)
                .HasForeignKey(bal => bal.BaseBoardActionId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BoardActionLink>()
                .HasOne(bal => bal.LinkedBoardAction)
                .WithMany()
                .HasForeignKey(bal => bal.LinkedBoardActionId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Project>().HasQueryFilter(p => !p.Deleted);
        }
    }
}