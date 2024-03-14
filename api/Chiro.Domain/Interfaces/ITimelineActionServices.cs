using Chiro.Domain.DTOs;

namespace Chiro.Domain.Interfaces
{
    public interface ITimelineActionServices
    {
        Task<bool> CreateTimelineAction(CreateTimelineActionDTO createTimelineActionDTO);
        Task<bool> ChangePeriod(ChangePeriodDTO changePeriodDTO);
    }
}
