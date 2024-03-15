using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;

namespace Chiro.Infra.Interfaces
{
    public interface ITimelineActionRepository
    {
        Task<bool> CreateTimelineActionAsync(TimelineAction timelineAction);

        Task<bool> ChangePeriodAsync(TimelineAction timelineAction);
    }
}