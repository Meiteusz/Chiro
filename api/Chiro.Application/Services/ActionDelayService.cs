using Chiro.Application.Interfaces;
using Chiro.Domain.Entities;
using Chiro.Infra;

namespace Chiro.Application.Services
{
    public class ActionDelayService : IActionDelayService
    {
        private readonly ProjectContext _context;
        private readonly IProjectService _projectService;

        public ActionDelayService(ProjectContext context, IProjectService projectService)
        {
            _context = context;
            _projectService = projectService;
        }

        public async Task DelayActionsByProjectId(long projectId)
        {
            var project = await _projectService.GetProjectAsync(projectId);
            if (!ShouldDelayBoardActions(project))
            {
                return;
            }

            foreach (var boardAction in project.BoardActions.Where(boardAction => boardAction.EndDate > DateTime.Now))
            {
                boardAction.DelaySelfAndChilds();
            }

            await _context.SaveChangesAsync();
        }

        private bool ShouldDelayBoardActions(Project project)
        {
            if (project is null)
            {
                return false;
            }

            if (project.BoardActions is null || (project.BoardActions != null && !project.BoardActions.Any()))
            {
                return false;
            }

            if (project.BoardActions is null || (project.BoardActions != null && !project.BoardActions.Exists(w => w.EndDate > DateTime.Now)))
            {
                return false;
            }

            return true;
        }
    }
}
