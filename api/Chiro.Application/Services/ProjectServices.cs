using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;
using Chiro.Infra.Interfaces;

namespace Chiro.Application.Services
{
    public class ProjectServices : IProjectServices
    {
        private readonly IProjectRepository _repository;
        public ProjectServices(IProjectRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> CreateProject(CreateProjectDTO createProjectDTO)
        {
            var project = new Domain.Entities.Project
            {
                Name = createProjectDTO.Name,
                Password = createProjectDTO.Password,
                Board = new(),
                Timeline = new(),
            };

            return await _repository.CreateProjectAsync(project);
        }

        public async Task<Project> GetProject(long projectId)
        {
            return await _repository.GetProjectAsync(projectId);   
        }

        public async Task<List<Project>> GetProjects()
        {
            return await _repository.GetProjectsAsync(); 
        }
    }
}
