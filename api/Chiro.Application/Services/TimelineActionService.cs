using Chiro.Application.Exceptions;
using Chiro.Application.Interfaces;
using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;

namespace Chiro.Application.Services
{
    public class TimelineActionService : ITimelineActionService
    {
        private readonly ITimelineActionRepository _repository;

        public TimelineActionService(ITimelineActionRepository actionRepository)
        {
            _repository = actionRepository;
        }

        public async Task<bool> ChangePeriod(ChangePeriodDTO changePeriodDTO)
        {
            var timeline = new TimelineAction
            {
                StartDate = changePeriodDTO.StartDate,
                EndDate = changePeriodDTO.EndDate,
            };

            return await _repository.ChangePeriodAsync(changePeriodDTO.Id, timeline);
        }

        public async Task<bool> CreateTimelineAction(CreateTimelineActionDTO createTimelineActionDTO)
        {
            var timeline = new TimelineAction
            {
                BoardActionId = createTimelineActionDTO.BoardActionId,
                StartDate = createTimelineActionDTO.StartDate,
                EndDate = createTimelineActionDTO.EndDate,
            };

            return await _repository.CreateTimelineActionAsync(timeline);
        }

        public async Task<bool> ConcludeTimelineAction(ConcludeTimelineActionDTO concludeTimelineActionDTO)
        {
            var timeline = new TimelineAction
            {
                ConcludedAt = DateTime.Now
            };

            return await _repository.ConcludeTimelineActionAsync(concludeTimelineActionDTO.Id, timeline);
        }
    }
}