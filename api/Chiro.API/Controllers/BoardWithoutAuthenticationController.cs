using Chiro.Application.Interfaces;
using Chiro.Domain.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chiro.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/board-without-authentication")]
    public class BoardWithoutAuthenticationController : ControllerBase
    {
        private IBoardWithoutAuthenticationService _service;
        public BoardWithoutAuthenticationController(IBoardWithoutAuthenticationService service)
        {
            _service = service;   
        }

        [HttpGet("create-link")]
        public async Task<IActionResult> CreateLink(string projectId, string randomNumbers)
        {
            try
            {
                if (!long.TryParse(projectId, out long _projectId)) 
                {
                    return BadRequest("ID do projeto inválido.");
                }

                if (!int.TryParse(randomNumbers, out int _randomNumbers))
                {
                    return BadRequest("Número aleatório inválido");
                }

                var token = _service.GenerateToken(_projectId, _randomNumbers);
                var url = _service.GenerateUrl(token);

                return Ok(url);
            }
            catch (Exception e)
            {
                return BadRequest(new { Message = "Ocorreu um erro ao gerar o link.", Error = e.Message });
            }
        }

        [AllowAnonymous]
        [HttpGet("get-project-with-token")]
        public async Task<IActionResult> GetProjectIdWithToken(string token)
        {         
            try
            {
                var projectId = _service.DecryptToken(token);
                return Ok(projectId);
            }
            catch (Exception e)
            {
                return BadRequest(new { Message = "Ocorreu um erro ao carregar o link.", Error = e.Message });
            }
        }
    }
}
