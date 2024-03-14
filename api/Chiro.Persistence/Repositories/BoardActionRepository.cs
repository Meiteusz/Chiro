using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;
using Chiro.Infra;
using Chiro.Infra.Interfaces;

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

        public async Task<bool> ChangeColorAsync(BoardAction boardAction)
        {
            using (var context = new ProjectContext())
            {
                return await context.BoardActions.Where(w => w.Id == boardAction.Id).UpdateFromQueryAsync(x => boardAction) > 0;
            }
        }

        public async Task<bool> ResizeAsync(BoardAction boardAction)
        {
            using (var context = new ProjectContext())
            {
                return await context.BoardActions.Where(w => w.Id == boardAction.Id).UpdateFromQueryAsync(x => boardAction) > 0;
            }
        }

        public async Task<bool> MoveAsync(BoardAction boardAction)
        {
            using (var context = new ProjectContext())
            {
                return await context.BoardActions.Where(w => w.Id == boardAction.Id).UpdateFromQueryAsync(x => boardAction) > 0;
            }
        }
    }
}