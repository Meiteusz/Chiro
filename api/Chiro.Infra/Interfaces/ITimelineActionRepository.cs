using Chiro.Domain.DTOs;

namespace Chiro.Infra.Interfaces
{
    public interface ITimelineActionRepository
    {
        Task<bool> CreateTimelineActionAsync(CreateTimelineActionDTO createTimelineActionDTO);

        Task<bool> ChangePeriodAsync(ChangePeriodDTO changePeriodDTO);
    }
}