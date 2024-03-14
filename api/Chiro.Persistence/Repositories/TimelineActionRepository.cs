using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;
using Chiro.Infra;
using Chiro.Infra.Interfaces;

namespace Chiro.Persistence.Repositories
{
    public class TimelineActionRepository : ITimelineActionRepository
    {
        public async Task<bool> CreateTimelineActionAsync(TimelineAction timelineAction)
        {
            using (var context = new ProjectContext())
            {
                await context.TimelineActions.AddRangeAsync(timelineAction);

                return await context.SaveChangesAsync() > 0;
            }
        }

        public async Task<bool> ChangePeriodAsync(TimelineAction timelineAction)
        {
            using (var context = new ProjectContext())
            {
                return await context.TimelineActions.Where(w => w.Id == timelineAction.Id).UpdateFromQueryAsync(x => timelineAction) > 0;
            }
        }
    }
}