using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;
using Chiro.Infra.Interfaces;

namespace Chiro.Application.Services
{
    public class TimelineActionServices : ITimelineActionServices
    {
        private readonly ITimelineActionRepository _actionRepository;
        public TimelineActionServices(ITimelineActionRepository actionRepository)
        {
            _actionRepository = actionRepository;
        }
        public async Task<bool> ChangePeriod(ChangePeriodDTO changePeriodDTO)
        {
            var timeline = new TimelineAction
            {
                StartDate = changePeriodDTO.StartDate,
                EndDate = changePeriodDTO.EndDate,
            };

            return await _actionRepository.ChangePeriodAsync(timeline);
        }

        public async Task<bool> CreateTimelineAction(CreateTimelineActionDTO createTimelineActionDTO)
        {
            var timeline = new TimelineAction
            {
                BoardActionId = createTimelineActionDTO.BoardActionId,
                StartDate = createTimelineActionDTO.StartDate,
                EndDate = createTimelineActionDTO.EndDate,
            };

            return await _actionRepository.CreateTimelineActionAsync(timeline);
        }
    }
}
