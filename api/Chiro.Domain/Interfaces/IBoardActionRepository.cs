using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;

namespace Chiro.Domain.Interfaces
{
    public interface IBoardActionRepository
    {
        Task<bool> CreateBoardActionAsync(BoardAction boardAction);

        Task<bool> ChangeColorAsync(long boardActionId, BoardAction boardAction);

        Task<bool> ResizeAsync(long boardActionId, BoardAction boardAction);

        Task<bool> MoveAsync(long boardActionId, BoardAction boardAction);

        List<BoardAction> GetBoardActionsByProjectId(long projectId);

        Task<bool> ChangePeriodAsync(long BoardActionId, BoardAction BoardAction);

        Task<bool> ConcludeBoardActionAsync(long BoardActionId, BoardAction BoardAction);

        List<BoardAction> GetBoardActionByProjectId(long projectId);

        Task<bool> LinkAsync(BoardActionLink boardActionLink);

        Task<bool> SaveChangesAsync();
    }
}