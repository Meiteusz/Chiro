using Microsoft.AspNetCore.Mvc;
using Chiro.Domain.DTOs;
using Chiro.Infra.Interfaces;

namespace Chiro.API.Controllers
{
    [ApiController]
    [Route("api/v1/board-action")]
    public class BoardActionController : ControllerBase
    {
        private readonly ILogger<BoardActionController> _logger;
        private readonly IBoardActionRepository _boardActionRepository;

        public BoardActionController(ILogger<BoardActionController> logger, IBoardActionRepository boardActionRepository)
        {
            _logger = logger;
            _boardActionRepository = boardActionRepository;
        }

        /// <summary>
        /// Cria um board action.
        /// </summary>
        /// <param name="createBoardActionDTO"></param>
        /// <returns></returns>
        [HttpPost()]
        public async Task<IActionResult> CreateAsync([FromBody] CreateBoardActionDTO createBoardActionDTO)
        {
            await _boardActionRepository.CreateBoardActionAsync(createBoardActionDTO);
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
            await _boardActionRepository.ChangeColorAsync(changeBoardActionColorDTO);
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
            await _boardActionRepository.ResizeAsync(resizeBoardActionDTO);
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
            await _boardActionRepository.MoveAsync(moveBoardActionDTO);
            return Ok("Board Action Moved.");
        }
    }
}