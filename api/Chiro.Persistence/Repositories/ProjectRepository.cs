using Chiro.Domain.Interfaces;
using Chiro.Infra;
using Microsoft.EntityFrameworkCore;

namespace Chiro.Persistence.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly IBoardActionRepository _boardActionRepository;
        private readonly ITimelineActionRepository _timelineActionRepository;
        private readonly ProjectContext _context;
        public ProjectRepository(ProjectContext context, IBoardActionRepository boardActionRepository, ITimelineActionRepository timelineActionRepository)
        {
            _boardActionRepository = boardActionRepository;
            _timelineActionRepository = timelineActionRepository;
            _context = context;
        }

        public async Task<List<Domain.Entities.Project>> GetProjectsAsync()
        {
            return await _context.Projects.ToListAsync();
        }

        public async Task<Domain.Entities.Project> GetProjectAsync(long projectId)
        {
            var project = await _context.Projects.FirstAsync(w => w.Id == projectId);

            var boardActionsList = _boardActionRepository.GetBoardActionsByProjectId(projectId);
            var timeLineActionsList = _timelineActionRepository.GetTimelineActionByProjectId(projectId);

            project.BoardActionsList.AddRange(boardActionsList);
            project.TimelineActionsList.AddRange(timeLineActionsList);

            return project;
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