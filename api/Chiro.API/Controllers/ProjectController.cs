using Chiro.Application.Interfaces;
using Chiro.Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Chiro.API.Controllers
{
    [ApiController]
    [Route("api/v1/project")]
    public class ProjectController : ControllerBase
    {
        private readonly ILogger<BoardActionController> _logger;
        private readonly IProjectServices _projectService;

        public ProjectController(ILogger<BoardActionController> logger, IProjectServices projectService)
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
    }
}