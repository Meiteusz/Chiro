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
            return await _context.Projects.Where(w => w.Id == projectId)
                                          .Include(i => i.BoardActions).ThenInclude(i => i.BoardActionLinks)
                                          .FirstOrDefaultAsync();
        }

        public async Task<long> CreateProjectAsync(Domain.Entities.Project project)
        {
            await _context.Projects.AddAsync(project);
            await _context.SaveChangesAsync();
            return project.Id;
        }

        public async Task<bool> ResizeAsync(long projectId, Project project)
        {
            return await _context.Projects.Where(p => p.Id == projectId)
                                          .UpdateFromQueryAsync(x => new Project
                                          {
                                              Width = project.Width,
                                              Height = project.Height,
                                              PositionX = project.PositionX,
                                              PositionY = project.PositionY
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

        public async Task<bool> DeleteAsync(long projectId)
        {
            return await _context.Projects.Where(w => w.Id == projectId)
                                          .UpdateFromQueryAsync(u => new Project
                                          {
                                              Deleted = true
                                          }) > 0;
        }

        public async Task<bool> ChangeNameAsync(long projectId, Project project)
        {
            return await _context.Projects.Where(w => w.Id == projectId)
                                          .UpdateFromQueryAsync(u => new Project
                                          {
                                              Name = project.Name
                                          }) > 0;
        }

        public async Task<DateTime> GetCreationDate(long projectId)
            => await _context.Projects.Where(x => x.Id == projectId)
                                      .Select(s => s.CreationDate)
                                      .FirstOrDefaultAsync();

        public async Task<string> GetName(long projectId)
            => await _context.Projects.Where(x => x.Id == projectId)
                                      .Select(s => s.Name)
                                      .FirstOrDefaultAsync() ?? "Projeto desconhecido";
    }
}