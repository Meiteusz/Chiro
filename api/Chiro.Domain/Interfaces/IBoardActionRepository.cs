using Chiro.Domain.Entities;

namespace Chiro.Domain.Interfaces
{
    public interface IBoardActionRepository
    {
        Task<bool> CreateBoardActionAsync(BoardAction boardAction);

        Task<bool> ChangeColorAsync(long boardActionId, BoardAction boardAction);

        Task<bool> ResizeAsync(long boardActionId, BoardAction boardAction);

        Task<bool> MoveAsync(long boardActionId, BoardAction boardAction);
    }
}