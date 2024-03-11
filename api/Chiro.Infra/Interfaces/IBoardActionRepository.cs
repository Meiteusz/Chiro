using Chiro.Domain.DTOs;

namespace Chiro.Infra.Interfaces
{
    public interface IBoardActionRepository
    {
        Task<bool> CreateBoardActionAsync(CreateBoardActionDTO createBoardActionDTO);

        Task<bool> ChangeColorAsync(ChangeBoardActionColorDTO changeBoardActionColorDTO);

        Task<bool> ResizeAsync(ResizeBoardActionDTO resizeBoardActionDTO);

        Task<bool> MoveAsync(MoveBoardActionDTO moveBoardActionDTO);
    }
}