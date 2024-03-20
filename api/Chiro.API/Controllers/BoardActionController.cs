using Chiro.Application.Interfaces;
using Chiro.Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Chiro.API.Controllers
{
    [ApiController]
    [Route("api/v1/board-action")]
    public class BoardActionController : ControllerBase
    {
        private readonly ILogger<BoardActionController> _logger;
        private readonly IBoardActionServices _boardActionServices;

        public BoardActionController(ILogger<BoardActionController> logger, IBoardActionServices boardActionServices)
        {
            _logger = logger;
            _boardActionServices = boardActionServices;
        }

        /// <summary>
        /// Cria um board action.
        /// </summary>
        /// <param name="createBoardActionDTO"></param>
        /// <returns></returns>
        [HttpPost()]
        public async Task<IActionResult> CreateAsync([FromBody] CreateBoardActionDTO createBoardActionDTO)
        {
            var createdBoardAction = await _boardActionServices.CreateBoardAction(createBoardActionDTO);
            if (!createdBoardAction)
            {
                return BadRequest("Board Action couldn't be created.");
            }

            return Ok("Board Action Created.");
        }

        /// <summary>
        /// Altera a cor de um board action.
        /// </summary>
        /// <param name="changeBoardActionColorDTO"></param>
        /// <returns></returns>
        [HttpPost("change-color")]
        public async Task<IActionResult> ChangeColorAsync([FromBody] ChangeBoardActionColorDTO changeBoardActionColorDTO)
        {
            var changedColor = await _boardActionServices.ChangeColor(changeBoardActionColorDTO);
            if (!changedColor)
            {
                return BadRequest("Color couldn't be changed.");
            }

            return Ok("Color Changed.");
        }

        /// <summary>
        /// Altera o tamanho de um board action.
        /// </summary>
        /// <param name="resizeBoardActionDTO"></param>
        /// <returns></returns>
        [HttpPost("resize")]
        public async Task<IActionResult> ResizeAsync([FromBody] ResizeBoardActionDTO resizeBoardActionDTO)
        {
            var resized = await _boardActionServices.Resize(resizeBoardActionDTO);
            if (!resized)
            {
                return BadRequest("Board Action couldn't be resized.");
            }

            return Ok("Board Action Resized.");
        }

        /// <summary>
        /// Altera a posição de um board action.
        /// </summary>
        /// <param name="moveBoardActionDTO"></param>
        /// <returns></returns>
        [HttpPost("move")]
        public async Task<IActionResult> MoveAsync([FromBody] MoveBoardActionDTO moveBoardActionDTO)
        {
            var moved = await _boardActionServices.Move(moveBoardActionDTO);
            if (!moved)
            {
                return BadRequest("Board Action couldn't be moved.");
            }

            return Ok("Board Action Moved.");
        }
    }
}