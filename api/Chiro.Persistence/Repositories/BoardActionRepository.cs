using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;
using Chiro.Infra;

namespace Chiro.Persistence.Repositories
{
    public class BoardActionRepository : IBoardActionRepository
    {
        public async Task<bool> CreateBoardActionAsync(BoardAction boardAction)
        {
            using (var context = new ProjectContext())
            {
                await context.BoardActions.AddRangeAsync(boardAction);
                return await context.SaveChangesAsync() > 0;
            }
        }

        public async Task<bool> ChangeColorAsync(long boardActionId, BoardAction boardAction)
        {
            using (var context = new ProjectContext())
            {
                return await context.BoardActions.Where(w => w.Id == boardActionId)
                                                 .UpdateFromQueryAsync(x => boardAction) > 0;
            }
        }

        public async Task<bool> ResizeAsync(long boardActionId, BoardAction boardAction)
        {
            using (var context = new ProjectContext())
            {
                return await context.BoardActions.Where(w => w.Id == boardActionId)
                                                 .UpdateFromQueryAsync(x => boardAction) > 0;
            }
        }

        public async Task<bool> MoveAsync(long boardActionId, BoardAction boardAction)
        {
            using (var context = new ProjectContext())
            {
                return await context.BoardActions.Where(w => w.Id == boardActionId)
                                                 .UpdateFromQueryAsync(x => boardAction) > 0;
            }
        }
    }
}