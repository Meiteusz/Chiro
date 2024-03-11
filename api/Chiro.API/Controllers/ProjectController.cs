using Microsoft.AspNetCore.Mvc;
using Chiro.Domain.DTOs;
using Chiro.Infra.Interfaces;

namespace Chiro.API.Controllers
{
    [ApiController]
    [Route("api/v1/project")]
    public class ProjectController : ControllerBase
    {
        private readonly ILogger<BoardActionController> _logger;
        private readonly IProjectRepository _projectRepository;

        public ProjectController(ILogger<BoardActionController> logger, IProjectRepository ProjectRepository)
        {
            _logger = logger;
            _projectRepository = ProjectRepository;
        }

        /// <summary>
        /// Cria um novo projeto.
        /// </summary>
        /// <param name="createProjectDTO"></param>
        /// <returns></returns>
        [HttpPost()]
        public async Task<IActionResult> CreateProjectAsync([FromBody] CreateProjectDTO createProjectDTO)
        {
            await _projectRepository.CreateProjectAsync(createProjectDTO);
            return Ok("Project Created.");
        }

        /// <summary>
        /// Busca todos os projetos.
        /// </summary>
        /// <returns></returns>
        [HttpGet()]
        public async Task<IActionResult> GetProjectsAsync()
        {
            var result = await _projectRepository.GetProjectsAsync();
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
            var result = await _projectRepository.GetProjectAsync(id);
            return Ok(result);
        }
    }
}