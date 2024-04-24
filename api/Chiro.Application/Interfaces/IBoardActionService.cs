using Chiro.Domain.DTOs;

namespace Chiro.Application.Interfaces
{
    public interface IBoardActionService
    {
        Task<bool> CreateBoardAction(CreateBoardActionDTO createBoardActionDTO);

        Task<bool> ChangeColor(ChangeBoardActionColorDTO changeBoardActionColorDTO);

        Task<bool> Resize(ResizeBoardActionDTO resizeBoardActionDTO);

        Task<bool> Move(MoveBoardActionDTO moveBoardActionDTO);

        Task<bool> ChangePeriod(ChangePeriodDTO changePeriodDTO);

        Task<bool> ConcludeBoardAction(ConcludeBoardActionDTO concludeBoardActionDTO);
    }
}