using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;
using Chiro.Infra;

namespace Chiro.Persistence.Repositories
{
    public class TimelineActionRepository : ITimelineActionRepository
    {
        private readonly ProjectContext _context;

        public TimelineActionRepository(ProjectContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateTimelineActionAsync(TimelineAction timelineAction)
        {
            await _context.TimelineActions.AddAsync(timelineAction);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ChangePeriodAsync(long timelineActionId, TimelineAction timelineAction)
        {
            return await _context.TimelineActions.Where(w => w.Id == timelineActionId)
                                                 .UpdateFromQueryAsync(x => new TimelineAction
                                                 {
                                                     StartDate = timelineAction.StartDate,
                                                     EndDate = timelineAction.EndDate,
                                                 }) > 0;
        }

        public async Task<bool> ConcludeTimelineActionAsync(long timelineActionId, TimelineAction timelineAction)
        {
            return await _context.TimelineActions.Where(w => w.Id == timelineActionId)
                                                 .UpdateFromQueryAsync(x => new TimelineAction
                                                 {
                                                     ConcludedAt = timelineAction.ConcludedAt,
                                                 }) > 0;
        }
    }
}