using Chiro.Application.Interfaces;
using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;
using Chiro.Domain.Utils;

namespace Chiro.Application.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _repository;

        public ProjectService(IProjectRepository repository)
        {
            _repository = repository;
        }

        public async Task<long> CreateProject(CreateProjectDTO createProjectDTO)
        {
            ArgumentNullException.ThrowIfNull(createProjectDTO);

            return await _repository.CreateProjectAsync(new Domain.Entities.Project
            {
                Name = createProjectDTO.Name,
                Password = Hasher.Encrypt(createProjectDTO.Password, "2b!BDp9fUM2OcGYJ"),
                PositionX = createProjectDTO.PositionX,
                PositionY = createProjectDTO.PositionY,
                Color = createProjectDTO.Color,
                Height = createProjectDTO.Height,
                Width = createProjectDTO.Width
            });
        }

        public async Task<Project?> GetProjectAsync(long projectId)
        {
            ArgumentOutOfRangeException.ThrowIfNegativeOrZero(projectId);

            return await _repository.GetProjectAsync(projectId);
        }

        public async Task<Project?> GetDelayedProjectAsync(long projectId)
        {
            ArgumentOutOfRangeException.ThrowIfNegativeOrZero(projectId);

            //await _actionDelayService.DelayActionsByProjectId(projectId);
            return await GetProjectAsync(projectId);
        }

        public async Task<List<Project>> GetProjectsAsync()
        {
            return await _repository.GetProjectsAsync();
        }

        public async Task<bool> ResizeAsync(ResizeProjectDTO resizeProjectDTO)
        {
            ArgumentNullException.ThrowIfNull(resizeProjectDTO);

            return await _repository.ResizeAsync(resizeProjectDTO.Id, new Project
            {
                Width = resizeProjectDTO.Width,
                Height = resizeProjectDTO.Height,
                PositionX = resizeProjectDTO.PositionX,
                PositionY = resizeProjectDTO.PositionY
            });
        }

        public async Task<bool> MoveAsync(MoveProjectDTO moveProjectDTO)
        {
            ArgumentNullException.ThrowIfNull(moveProjectDTO);

            return await _repository.MoveAsync(new Project
            {
                Id = moveProjectDTO.Id,
                PositionX = moveProjectDTO.PositionX,
                PositionY = moveProjectDTO.PositionY
            });
        }

        public async Task<bool> ChangeColorAsync(ChangeProjectColorDTO changeProjectColorDTO)
        {
            ArgumentNullException.ThrowIfNull(changeProjectColorDTO);

            return await _repository.ChangeColorAsync(new Project
            {
                Id = changeProjectColorDTO.Id,
                Color = changeProjectColorDTO.Color
            });
        }

        public async Task<bool> DeleteAsync(long projectId)
        {
            ArgumentOutOfRangeException.ThrowIfNegativeOrZero(projectId);

            return await _repository.DeleteAsync(projectId);
        }

        public async Task<List<Project>> GetProjectsWithActionsAsync()
        {
            return await _repository.GetProjectsWithActionsAsync();
        }

        public async Task<bool> ChangeNameAsync(ChangeProjectNameDTO changeProjectNameDTO)
        {
            ArgumentNullException.ThrowIfNull(changeProjectNameDTO);

            return await _repository.ChangeNameAsync(changeProjectNameDTO.Id, new Project
            {
                Name = changeProjectNameDTO.Name,
            });
        }
    }
}
