using Chiro.Domain.DTOs;

namespace Chiro.Application.Interfaces
{
    public interface IBoardActionService
    {
        Task<long> CreateBoardActionAsync(CreateBoardActionDTO createBoardActionDTO);

        Task<bool> ChangeColorAsync(ChangeBoardActionColorDTO changeBoardActionColorDTO);

        Task<bool> ResizeAsync(ResizeBoardActionDTO resizeBoardActionDTO);

        Task<bool> MoveAsync(MoveBoardActionDTO moveBoardActionDTO);

        Task<bool> ChangePeriodAsync(ChangePeriodDTO changePeriodDTO);

        Task<bool> ConcludeBoardActionAsync(ConcludeBoardActionDTO concludeBoardActionDTO);

        Task<bool> LinkAsync(LinkBoardActionDTO linkBoardActionDTO);

        Task DelayBoardActionsFromProjectAsync(long projectId);

        Task<bool> DeleteAsync(long boardActionId);

        Task<bool> ChangeContentAsync(ChangeBoardActionContentDTO changeBoardActionContentDTO);
    }
}