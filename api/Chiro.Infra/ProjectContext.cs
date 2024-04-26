﻿using Chiro.Domain.Entities;
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
                optionsBuilder.UseNpgsql("Host=localhost:5432; Database=chiro_nova; Username=pguser; Password=pgadmin");
        }
    }
}