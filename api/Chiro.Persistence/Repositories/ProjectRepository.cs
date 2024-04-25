using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;
using Chiro.Infra;
using Microsoft.EntityFrameworkCore;

namespace Chiro.Persistence.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly ProjectContext _context;
        public ProjectRepository(ProjectContext context)
        {
            _context = context;
        }

        public async Task<List<Domain.Entities.Project>> GetProjectsAsync()
        {
            return await _context.Projects.ToListAsync();
        }

        public async Task<Domain.Entities.Project?> GetProjectAsync(long projectId)
        {
            return await _context.Projects.Include(i => i.BoardActions)
                                          .ThenInclude(i => i.BoardActionLinks)
                                          .FirstOrDefaultAsync();
        }

        public async Task<bool> CreateProjectAsync(Domain.Entities.Project project)
        {
            await _context.Projects.AddAsync(project);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> AuthenticateProjectSessionAsync(long projectId, string password)
        {
            return await _context.Projects.AnyAsync(w => w.Id == projectId && w.Password == password);
        }

        public async Task<bool> ResizeAsync(long projectId, Project project)
        {
            return await _context.Projects.Where(p => p.Id == projectId)
                                              .UpdateFromQueryAsync(x => new Project
                                              {
                                                  Width = project.Width,
                                                  Height = project.Height
                                              }) > 0;
        }

        public async Task<bool> MoveAsync(Project project)
        {
            return await _context.Projects.Where(p => p.Id == project.Id)
                                              .UpdateFromQueryAsync(x => new Project
                                              {
                                                  PositionX = project.PositionX,
                                                  PositionY = project.PositionY
                                              }) > 0;
        }

        public async Task<bool> ChangeColorAsync(Project project)
        {
            return await _context.Projects.Where(p => p.Id == project.Id)
                                              .UpdateFromQueryAsync(x => new Project
                                              {
                                                  Color = project.Color
                                              }) > 0;
        }

        public async Task<List<Domain.Entities.Project>> GetProjectsWithActionsAsync()
        {
            return await _context.Projects.Include(i => i.BoardActions).ThenInclude(i => i.BoardActionLinks)
                                          .ToListAsync();
        }
    }
}