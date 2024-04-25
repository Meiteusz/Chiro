using Chiro.Application.Interfaces;
using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;
using Chiro.Domain.Utils;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Chiro.Application.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _repository;
        private readonly IConfiguration _configuration;
        private readonly IActionDelayService _actionDelayService;

        public ProjectService(IProjectRepository repository, IConfiguration configuration, IActionDelayService actionDelayService)
        {
            _repository = repository;
            _configuration = configuration;
            _actionDelayService = actionDelayService;
        }

        public async Task<bool> CreateProject(CreateProjectDTO createProjectDTO)
        {
            var project = new Domain.Entities.Project
            {
                Name = createProjectDTO.Name,
                Password = Hasher.Encrypt(createProjectDTO.Password, "2b!BDp9fUM2OcGYJ"),
            };

            return await _repository.CreateProjectAsync(project);
        }

        public async Task<Project?> GetProjectAsync(long projectId)
        {
            return await _repository.GetProjectAsync(projectId);
        }

        public async Task<Project?> GetDelayedProjectAsync(long projectId)
        {
            await _actionDelayService.DelayActionsByProjectId(projectId);
            return await GetProjectAsync(projectId);
        }

        public async Task<List<Project>> GetProjectsAsync()
        {
            return await _repository.GetProjectsAsync();
        }

        public string AuthenticateProjectSession(AuthenticateProjectSessionDTO authenticateProjectSessionDTO)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var Sectoken = new JwtSecurityToken(_configuration["Jwt:Issuer"],
              _configuration["Jwt:Issuer"],
              null,
              expires: DateTime.Now.AddMinutes(120),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(Sectoken);
        }

        public async Task<bool> ResizeAsync(ResizeProjectDTO resizeProjectDTO)
        {
            var project = new Project
            {
                Width = resizeProjectDTO.Width,
                Height = resizeProjectDTO.Height
            };

            return await _repository.ResizeAsync(resizeProjectDTO.Id, project);
        }

        public async Task<bool> MoveAsync(MoveProjectDTO moveProjectDTO)
        {
            var project = new Project
            {
                Id = moveProjectDTO.Id,
                PositionX = moveProjectDTO.PositionX,
                PositionY = moveProjectDTO.PositionY
            };

            return await _repository.MoveAsync(project);
        }

        public async Task<bool> ChangeColorAsync(ChangeProjectColorDTO changeProjectColorDTO)
        {
            var project = new Project
            {
                Id = changeProjectColorDTO.Id,
                Color = changeProjectColorDTO.Color
            };

            return await _repository.ChangeColorAsync(project);
        }

        public async Task<List<Project>> GetProjectsWithActionsAsync()
        {
            return await _repository.GetProjectsWithActionsAsync();
        }
    }
}
