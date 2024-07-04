using Chiro.Domain.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chiro.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/board-without-authentication")]
    public class BoardWithoutAuthentication : ControllerBase
    {
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

                var token = new AES().GenerateAesTokenWithProjectId(_projectId, _randomNumbers);
                var url = $"http://localhost:3000/WithoutAuthentication?param={token}";

                return Ok(url);
            }
            catch (Exception e)
            {
                return BadRequest(new { Message = "Ocorreu um erro ao gerar o link.", Error = e.Message });
            }
        }

        [HttpGet("get-project-with-token")]
        public async Task<IActionResult> GetProjectIdWithToken(string token)
        {
            var projectId = new AES().DecryptAesToken(token).Split("|")[0];

            try
            {
                return Ok(projectId);
            }
            catch (Exception e)
            {
                return BadRequest(new { Message = "Ocorreu um erro ao carregar o link.", Error = e.Message });
            }
        }
    }
}
