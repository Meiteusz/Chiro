using Chiro.Domain.Entities;

namespace Chiro.Domain.Interfaces
{
    public interface ITimelineActionRepository
    {
        Task<bool> CreateTimelineActionAsync(TimelineAction timelineAction);

        Task<bool> ChangePeriodAsync(long timelineActionId, TimelineAction timelineAction);

        Task<bool> ConcludeTimelineAction(long timelineActionId, TimelineAction timelineAction);
    }
}