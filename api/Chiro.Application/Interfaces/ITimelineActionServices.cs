using Chiro.Domain.DTOs;

namespace Chiro.Application.Interfaces
{
    public interface ITimelineActionService
    {
        Task<bool> CreateTimelineAction(CreateTimelineActionDTO createTimelineActionDTO);

        Task<bool> ChangePeriod(ChangePeriodDTO changePeriodDTO);

        Task<bool> ConcludeTimelineAction(ConcludeTimelineActionDTO concludeTimelineActionDTO);
    }
}