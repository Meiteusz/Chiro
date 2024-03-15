using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;

namespace Chiro.Infra.Interfaces
{
    public interface IBoardActionRepository
    {
        Task<bool> CreateBoardActionAsync(BoardAction boardAction);

        Task<bool> ChangeColorAsync(BoardAction boardAction);

        Task<bool> ResizeAsync(BoardAction boardAction);

        Task<bool> MoveAsync(BoardAction boardAction);
    }
}