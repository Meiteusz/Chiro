using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;
using Chiro.Infra;
using Microsoft.EntityFrameworkCore;

namespace Chiro.Persistence.Repositories
{
    public class BoardActionRepository : IBoardActionRepository
    {
        private readonly ProjectContext _context;

        public BoardActionRepository(ProjectContext context)
        {
            _context = context;
        }

        public async Task<long> CreateBoardActionAsync(BoardAction boardAction)
        {
            await _context.BoardActions.AddRangeAsync(boardAction);
            await _context.SaveChangesAsync();
            return boardAction.Id;
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
                                                  Height = boardAction.Height,
                                                  PositionX = boardAction.PositionX,
                                                  PositionY = boardAction.PositionY
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

        public async Task<bool> ChangePeriodAsync(long boardActionId, BoardAction boardAction)
        {
            return await _context.BoardActions.Where(w => w.Id == boardActionId)
                                              .UpdateFromQueryAsync(x => new BoardAction
                                              {
                                                  StartDate = boardAction.StartDate,
                                                  EndDate = boardAction.EndDate,
                                                  TimelineRow = boardAction.TimelineRow
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

        public async Task<bool> DeleteAsync(long boardActionId)
        {
            return await _context.BoardActions.Where(w => w.Id == boardActionId)
                                              .DeleteFromQueryAsync() > 0;
        }

        public async Task<bool> ChangeContentAsync(long boardActionId, BoardAction boardAction)
        {
            return await _context.BoardActions.Where(w => w.Id == boardActionId)
                                              .UpdateFromQueryAsync(x => new BoardAction
                                              {
                                                  Content = boardAction.Content,
                                              }) > 0;
        }

        public async Task<DateTime> GetNewerEndDateByProjectId(long projectId)
            => await _context.BoardActions.Where(x => x.ProjectId == projectId)
                                          .OrderByDescending(x => x.EndDate)
                                          .Select(s => s.EndDate.GetValueOrDefault())
                                          .FirstOrDefaultAsync();

        public async Task<int> GetBiggestTimelineRowByProjectId(long projectId)
            => await _context.BoardActions.Where(x => x.ProjectId == projectId)
                                          .OrderByDescending(x => x.TimelineRow)
                                          .Select(s => s.TimelineRow)
                                          .FirstOrDefaultAsync() ?? 0;
    }
}