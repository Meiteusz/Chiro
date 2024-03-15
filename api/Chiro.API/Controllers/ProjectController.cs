using Microsoft.AspNetCore.Mvc;
using Chiro.Domain.DTOs;
using Chiro.Domain.Interfaces;

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
            await _projectService.CreateProject(createProjectDTO);
            return Ok("Project Created.");
        }

        /// <summary>
        /// Busca todos os projetos.
        /// </summary>
        /// <returns></returns>
        [HttpGet()]
        public async Task<IActionResult> GetProjectsAsync()
        {
            var result = await _projectService.GetProjects();
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
            var result = await _projectService.GetProject(id);
            return Ok(result);
        }
    }
}