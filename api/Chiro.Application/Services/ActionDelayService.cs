using Chiro.Application.Exceptions;
using Chiro.Infra;
using Microsoft.EntityFrameworkCore;

namespace Chiro.Application.Services
{
    public class ActionDelayService : IActionDelayService
    {
        private readonly ProjectContext _context;
        public ActionDelayService(ProjectContext context)
        {
            _context = context;
        }

        public async Task DelayActionsByProjectId(long projectId)
        {
            var project = await _context.Projects.Where(w => w.Id == projectId).Include(i => i.BoardActions)
                                          .ThenInclude(i => i.BoardActionLinks)
                                          .FirstOrDefaultAsync();

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

            await _context.SaveChangesAsync();
        }
    }
}
