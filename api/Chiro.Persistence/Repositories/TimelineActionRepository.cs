using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;
using Chiro.Infra;

namespace Chiro.Persistence.Repositories
{
    public class TimelineActionRepository : ITimelineActionRepository
    {
        public async Task<bool> CreateTimelineActionAsync(TimelineAction timelineAction)
        {
            using (var context = new ProjectContext())
            {
                await context.TimelineActions.AddAsync(timelineAction);
                return await context.SaveChangesAsync() > 0;
            }
        }

        public async Task<bool> ChangePeriodAsync(long timelineActionId, TimelineAction timelineAction)
        {
            using (var context = new ProjectContext())
            {
                return await context.TimelineActions.Where(w => w.Id == timelineActionId)
                                                    .UpdateFromQueryAsync(x => timelineAction) > 0;
            }
        }

        public async Task<bool> ConcludeTimelineAction(long timelineActionId, TimelineAction timelineAction)
        {
            using (var context = new ProjectContext())
            {
                return await context.TimelineActions.Where(w => w.Id == timelineActionId)
                                                    .UpdateFromQueryAsync(x => timelineAction) > 0;
            }
        }
    }
}