using Chiro.Domain.DTOs;
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

        public List<BoardAction> GetBoardActionsByProjectId(long projectId)
        {
            return _context.BoardActions.Where(board => board.ProjectId == projectId).ToList();
        }

        public async Task<bool> ChangePeriodAsync(long BoardActionId, BoardAction BoardAction)
        {
            return await _context.BoardActions.Where(w => w.Id == BoardActionId)
                                              .UpdateFromQueryAsync(x => new BoardAction
                                              {
                                                  StartDate = BoardAction.StartDate,
                                                  EndDate = BoardAction.EndDate,
                                              }) > 0;
        }

        public async Task<bool> ConcludeBoardActionAsync(long BoardActionId, BoardAction BoardAction)
        {
            return await _context.BoardActions.Where(w => w.Id == BoardActionId)
                                              .UpdateFromQueryAsync(x => new BoardAction
                                              {
                                                  ConcludedAt = BoardAction.ConcludedAt,
                                              }) > 0;
        }

        public List<BoardAction> GetBoardActionByProjectId(long projectId)
        {
            return _context.BoardActions.Where(time => time.ProjectId == projectId).ToList();
        }

        public async Task<bool> LinkAsync(BoardActionLink boardActionLink)
        {
            _context.BoardActionLinks.Add(boardActionLink);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}