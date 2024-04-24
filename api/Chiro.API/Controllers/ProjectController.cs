using Chiro.Application.Interfaces;
using Chiro.Application.Services;
using Chiro.Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Chiro.API.Controllers
{
    [ApiController]
    [Route("api/v1/project")]
    public class ProjectController : ControllerBase
    {
        private readonly ILogger<BoardActionController> _logger;
        private readonly IProjectService _projectService;

        public ProjectController(ILogger<BoardActionController> logger, IProjectService projectService)
        {
            _logger = logger;
            _projectService = projectService;
        }

        /// <summary>
        /// Cria um novo projeto.
        /// </summary>
        /// <param name="createProjectDTO"></param>
        /// <returns></returns>
        [HttpPost()]
        public async Task<IActionResult> CreateProjectAsync([FromBody] CreateProjectDTO createProjectDTO)
        {
            var projectCreated = await _projectService.CreateProject(createProjectDTO);
            if (!projectCreated)
            {
                return BadRequest("Project couldn't be created.");
            }

            return Ok("Project Created.");
        }

        /// <summary>
        /// Busca todos os projetos.
        /// </summary>
        /// <returns></returns>
        [HttpGet()]
        public async Task<IActionResult> GetProjectsAsync()
        {
            var result = await _projectService.GetProjectsAsync();
            return Ok(result);
        }

        /// <summary>
        /// Buscar um único projeto juntamente com o Board e a Timeline.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectAsync(long id)
        {
            var result = await _projectService.GetProjectAsync(id);
            if (result is null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        /// <summary>
        /// Autentica a senha com o projeto (v1).
        /// </summary>
        /// <param name="authenticateProjectSessionDTO"></param>
        /// <returns></returns>
        [HttpPost("authenticate")]
        public async Task<IActionResult> AuthenticateProjectSessionAsync([FromBody] AuthenticateProjectSessionDTO authenticateProjectSessionDTO)
        {
            var authenticated = await _projectService.AuthenticateProjectSessionAsync(authenticateProjectSessionDTO);
            if (!authenticated)
            {
                return Unauthorized("Wrong password.");
            }

            return Ok("Authenticated.");
        }

        /// <summary>
        /// Altera o tamanho da bolha do projeto.
        /// </summary>
        /// <param name="resizeProjectDTO"></param>
        /// <returns></returns>
        [HttpPost("resize")]
        public async Task<IActionResult> ResizeAsync([FromBody] ResizeProjectDTO resizeProjectDTO)
        {
            var resized = await _projectService.ResizeAsync(resizeProjectDTO);

            if (!resized)
            {
                return BadRequest("Não foi possível redimencionar o projeto.");
            }

            return Ok("Projeto redimencionado com sucesso.");
        }

        /// <summary>
        /// Altera a posição de um projeto.
        /// </summary>
        /// <param name="moveProjectDTO"></param>
        /// <returns></returns>
        [HttpPost("move")]
        public async Task<IActionResult> MoveAsync([FromBody] MoveProjectDTO moveProjectDTO)
        {
            var moved = await _projectService.MoveAsync(moveProjectDTO);
            if (!moved)
            {
                return BadRequest("Projeto não pode ser movido.");
            }

            return Ok("Projeto movido.");
        }

        /// <summary>
        /// Altera a cor de um board action.
        /// </summary>
        /// <param name="changeProjectColorDTO"></param>
        /// <returns></returns>
        [HttpPost("change-color")]
        public async Task<IActionResult> ChangeColorAsync([FromBody] ChangeProjectColorDTO changeProjectColorDTO)
        {
            var changedColor = await _projectService.ChangeColorAsync(changeProjectColorDTO);
            if (!changedColor)
            {
                return BadRequest("Não foi possível alterar a cor do projeto.");
            }

            return Ok("Cor alterada com sucesso.");
        }
    }
}