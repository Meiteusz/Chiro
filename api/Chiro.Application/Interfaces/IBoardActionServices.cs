using Chiro.Domain.DTOs;

namespace Chiro.Application.Interfaces
{
    public interface IBoardActionServices
    {
        Task<bool> CreateBoardAction(CreateBoardActionDTO createBoardActionDTO);

        Task<bool> ChangeColor(ChangeBoardActionColorDTO changeBoardActionColorDTO);

        Task<bool> Resize(ResizeBoardActionDTO resizeBoardActionDTO);

        Task<bool> Move(MoveBoardActionDTO moveBoardActionDTO);
    }
}