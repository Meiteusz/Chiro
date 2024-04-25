using Chiro.Application.Exceptions;
using Chiro.Application.Interfaces;

namespace Chiro.Application.Services
{
    public class ActionDelayService : IActionDelayService
    {
        private readonly IProjectService _projectService;
        public ActionDelayService(IProjectService projectService)
        {
            _projectService = projectService;
        }

        public async Task DelayActionsByProjectId(long projectId)
        {
            var project = await _projectService.GetProjectAsync(projectId);
            if (project is null)
            {
                throw new BusinessException("Project not found.");
            }

            if (project.BoardActions is null || (project.BoardActions != null && !project.BoardActions.Any()))
            {
                return;
            }

            if (project.BoardActions is null || (project.BoardActions != null && !project.BoardActions.Exists(w => w.EndDate > DateTime.Now)))
            {
                return;
            }

            foreach (var boardAction in project.BoardActions.Where(boardAction => boardAction.EndDate > DateTime.Now))
            {
                boardAction.DelaySelfAndChilds();
            }
        }
    }
}
