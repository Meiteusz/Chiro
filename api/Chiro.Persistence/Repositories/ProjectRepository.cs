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
                                          .Include(i => i.TimelineActions)
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
    }
}