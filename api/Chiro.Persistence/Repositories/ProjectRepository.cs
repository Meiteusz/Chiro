using Chiro.Domain.Interfaces;
using Chiro.Infra;
using Microsoft.EntityFrameworkCore;

namespace Chiro.Persistence.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        public async Task<List<Domain.Entities.Project>> GetProjectsAsync()
        {
            using (var context = new ProjectContext())
            {
                return await context.Projects.ToListAsync();
            }
        }

        public async Task<Domain.Entities.Project> GetProjectAsync(long projectId)
        {
            using (var context = new ProjectContext())
            {
                return await context.Projects.Include(i => i.Timeline).ThenInclude(i => i.TimelineActions)
                                             .Include(i => i.Board).ThenInclude(i => i.BoardActions)
                                             .FirstAsync(w => w.Id == projectId);
            }
        }

        public async Task<bool> CreateProjectAsync(Domain.Entities.Project project)
        {
            using (var context = new ProjectContext())
            {
                await context.Projects.AddAsync(project);
                return await context.SaveChangesAsync() > 0;
            }
        }
    }
}