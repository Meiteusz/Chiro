using Chiro.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chiro.Infra
{
    public class ProjectContext : DbContext
    {
        public DbSet<Board> Boards { get; set; }
        public DbSet<BoardAction> BoardActions { get; set; }
        public DbSet<Domain.Entities.Project> Projects { get; set; }
        public DbSet<Timeline> Timelines { get; set; }
        public DbSet<TimelineAction> TimelineActions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost:5432; Database=chiro; Username=pguser; Password=pgadmin");
        }
    }
}