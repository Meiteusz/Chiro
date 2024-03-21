using Chiro.Application.Interfaces;
using Chiro.Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Chiro.API.Controllers
{
    [ApiController]
    [Route("api/v1/timeline-action")]
    public class TimelineActionController : ControllerBase
    {
        private readonly ILogger<BoardActionController> _logger;
        private readonly ITimelineActionService _timelineActionService;

        public TimelineActionController(ILogger<BoardActionController> logger, ITimelineActionService timelineActionServices)
        {
            _logger = logger;
            _timelineActionService = timelineActionServices;
        }

        /// <summary>
        /// Cria uma timeline action.
        /// </summary>
        /// <param name="createTimelineActionDTO"></param>
        /// <returns></returns>
        [HttpPost()]
        public async Task<IActionResult> CreateAsync([FromBody] CreateTimelineActionDTO createTimelineActionDTO)
        {
            var createdTimelineAction = await _timelineActionService.CreateTimelineAction(createTimelineActionDTO);
            if (!createdTimelineAction)
            {
                return BadRequest("Timeline Action couldn't be created.");
            }

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
            var chengedPeriod = await _timelineActionService.ChangePeriod(changePeriodDTO);
            if (!chengedPeriod)
            {
                return BadRequest("Period couldn't be changed.");
            }

            return Ok("Period Changed.");
        }

        /// <summary>
        /// Altera o tempo de uma timeline action dentro da timeline.
        /// </summary>
        /// <param name="changePeriodDTO"></param>
        /// <returns></returns>
        [HttpPost("conclude")]
        public async Task<IActionResult> ConcludeAsync([FromBody] ConcludeTimelineActionDTO concludeTimelineActionDTO)
        {
            var chengedPeriod = await _timelineActionService.ConcludeTimelineAction(concludeTimelineActionDTO);
            if (!chengedPeriod)
            {
                return BadRequest("Timeline Action couldn't be concluded.");
            }

            return Ok("Timeline Action Concluded.");
        }
    }
}