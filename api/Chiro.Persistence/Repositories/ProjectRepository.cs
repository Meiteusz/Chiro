using Microsoft.EntityFrameworkCore;
using Chiro.Domain.DTOs;
using Chiro.Infra;
using Chiro.Infra.Interfaces;

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

        public async Task<bool> CreateProjectAsync(CreateProjectDTO createProjectDTO)
        {
            using (var context = new ProjectContext())
            {
                await context.Projects.AddAsync(new Domain.Entities.Project
                {
                    Name = createProjectDTO.Name,
                    Password = createProjectDTO.Password,
                    Board = new(),
                    Timeline = new(),
                });

                return await context.SaveChangesAsync() > 0;
            }
        }
    }
}