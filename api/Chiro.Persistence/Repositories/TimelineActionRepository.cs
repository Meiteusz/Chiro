using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;
using Chiro.Infra;
using Chiro.Infra.Interfaces;

namespace Chiro.Persistence.Repositories
{
    public class TimelineActionRepository : ITimelineActionRepository
    {
        public async Task<bool> CreateTimelineActionAsync(CreateTimelineActionDTO createTimelineActionDTO)
        {
            using (var context = new ProjectContext())
            {
                await context.TimelineActions.AddRangeAsync(new TimelineAction
                {
                    BoardActionId = createTimelineActionDTO.BoardActionId,
                    StartDate = createTimelineActionDTO.StartDate,
                    EndDate = createTimelineActionDTO.EndDate,
                });

                return await context.SaveChangesAsync() > 0;
            }
        }

        public async Task<bool> ChangePeriodAsync(ChangePeriodDTO changePeriodDTO)
        {
            using (var context = new ProjectContext())
            {
                return await context.TimelineActions.Where(w => w.Id == changePeriodDTO.Id).UpdateFromQueryAsync(x => new TimelineAction
                {
                    StartDate = changePeriodDTO.StartDate,
                    EndDate = changePeriodDTO.EndDate,
                }) > 0;
            }
        }
    }
}