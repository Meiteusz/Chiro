using Microsoft.AspNetCore.Mvc;
using Chiro.Domain.DTOs;
using Chiro.Infra.Interfaces;

namespace Chiro.API.Controllers
{
    [ApiController]
    [Route("api/v1/timeline-action")]
    public class TimelineActionController : ControllerBase
    {
        private readonly ILogger<BoardActionController> _logger;
        private readonly ITimelineActionRepository _timelineActionRepository;

        public TimelineActionController(ILogger<BoardActionController> logger, ITimelineActionRepository timelineActionRepository)
        {
            _logger = logger;
            _timelineActionRepository = timelineActionRepository;
        }

        /// <summary>
        /// Cria uma timeline action.
        /// </summary>
        /// <param name="createTimelineActionDTO"></param>
        /// <returns></returns>
        [HttpPost()]
        public async Task<IActionResult> CreateAsync([FromBody] CreateTimelineActionDTO createTimelineActionDTO)
        {
            await _timelineActionRepository.CreateTimelineActionAsync(createTimelineActionDTO);
            return Ok("Timeline Action Created.");
        }

        /// <summary>
        /// Altera o tempo de uma timeline action dentro da timeline.
        /// </summary>
        /// <param name="changePeriodDTO"></param>
        /// <returns></returns>
        [HttpPost("change-period")]
        public async Task<IActionResult> ChangePeriodAsync([FromBody] ChangePeriodDTO changePeriodDTO)
        {
            await _timelineActionRepository.ChangePeriodAsync(changePeriodDTO);
            return Ok("Period Changed.");
        }
    }
}