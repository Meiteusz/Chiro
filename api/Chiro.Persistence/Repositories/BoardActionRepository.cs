using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;
using Chiro.Infra;

namespace Chiro.Persistence.Repositories
{
    public class BoardActionRepository : IBoardActionRepository
    {
        private readonly ProjectContext _context;

        public BoardActionRepository(ProjectContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateBoardActionAsync(BoardAction boardAction)
        {
            await _context.BoardActions.AddRangeAsync(boardAction);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ChangeColorAsync(long boardActionId, BoardAction boardAction)
        {
            return await _context.BoardActions.Where(w => w.Id == boardActionId)
                                              .UpdateFromQueryAsync(x => new BoardAction
                                              {
                                                  Color = boardAction.Color
                                              }) > 0;
        }

        public async Task<bool> ResizeAsync(long boardActionId, BoardAction boardAction)
        {
            return await _context.BoardActions.Where(w => w.Id == boardActionId)
                                              .UpdateFromQueryAsync(x => new BoardAction
                                              {
                                                  Width = boardAction.Width,
                                                  Height = boardAction.Height
                                              }) > 0;
        }

        public async Task<bool> MoveAsync(long boardActionId, BoardAction boardAction)
        {
            return await _context.BoardActions.Where(w => w.Id == boardActionId)
                                              .UpdateFromQueryAsync(x => new BoardAction
                                              {
                                                  PositionX = boardAction.PositionX,
                                                  PositionY = boardAction.PositionY
                                              }) > 0;
        }
    }
}