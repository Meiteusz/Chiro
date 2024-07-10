using Chiro.Application.Interfaces;
using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;
using Chiro.Domain.Utils;

namespace Chiro.Application.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;
        private readonly IBoardActionRepository _boardActionRepository;

        public ProjectService(IProjectRepository projectRepository, IBoardActionRepository boardActionRepository)
        {
            _projectRepository = projectRepository;
            _boardActionRepository = boardActionRepository;
        }

        public async Task<long> CreateProject(CreateProjectDTO createProjectDTO)
        {
            ArgumentNullException.ThrowIfNull(createProjectDTO);

            return await _projectRepository.CreateProjectAsync(new Domain.Entities.Project
            {
                Name = createProjectDTO.Name,
                Password = Hasher.Encrypt(createProjectDTO.Password, "2b!BDp9fUM2OcGYJ"),
                PositionX = createProjectDTO.PositionX,
                PositionY = createProjectDTO.PositionY,
                Color = createProjectDTO.Color,
                Height = createProjectDTO.Height,
                Width = createProjectDTO.Width,
                CreationDate = DateTime.UtcNow
            });
        }

        public async Task<Project?> GetProjectAsync(long projectId)
        {
            ArgumentOutOfRangeException.ThrowIfNegativeOrZero(projectId);

            return await _projectRepository.GetProjectAsync(projectId);
        }

        public async Task<Project?> GetDelayedProjectAsync(long projectId)
        {
            ArgumentOutOfRangeException.ThrowIfNegativeOrZero(projectId);

            //await _actionDelayService.DelayActionsByProjectId(projectId);
            return await GetProjectAsync(projectId);
        }

        public async Task<List<Project>> GetProjectsAsync()
        {
            return await _projectRepository.GetProjectsAsync();
        }

        public async Task<bool> ResizeAsync(ResizeProjectDTO resizeProjectDTO)
        {
            ArgumentNullException.ThrowIfNull(resizeProjectDTO);

            return await _projectRepository.ResizeAsync(resizeProjectDTO.Id, new Project
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

            return await _projectRepository.MoveAsync(new Project
            {
                Id = moveProjectDTO.Id,
                PositionX = moveProjectDTO.PositionX,
                PositionY = moveProjectDTO.PositionY
            });
        }

        public async Task<bool> ChangeColorAsync(ChangeProjectColorDTO changeProjectColorDTO)
        {
            ArgumentNullException.ThrowIfNull(changeProjectColorDTO);

            return await _projectRepository.ChangeColorAsync(new Project
            {
                Id = changeProjectColorDTO.Id,
                Color = changeProjectColorDTO.Color
            });
        }

        public async Task<bool> DeleteAsync(long projectId)
        {
            ArgumentOutOfRangeException.ThrowIfNegativeOrZero(projectId);

            return await _projectRepository.DeleteAsync(projectId);
        }

        public async Task<List<Project>> GetProjectsWithActionsAsync()
        {
            return await _projectRepository.GetProjectsWithActionsAsync();
        }

        public async Task<bool> ChangeNameAsync(ChangeProjectNameDTO changeProjectNameDTO)
        {
            ArgumentNullException.ThrowIfNull(changeProjectNameDTO);

            return await _projectRepository.ChangeNameAsync(changeProjectNameDTO.Id, new Project
            {
                Name = changeProjectNameDTO.Name,
            });
        }

        public async Task<TimelinePeriodDTO> GetTimelinePeriodAsync(long projectId)
        {
            ArgumentOutOfRangeException.ThrowIfNegativeOrZero(projectId);
            TimelinePeriodDTO period = new();

            var startDate = await _projectRepository.GetCreationDate(projectId);
            var newerEndDate = await _boardActionRepository.GetNewerEndDateByProjectId(projectId);

            period.StartDate = new DateTime(startDate.Year, 1, 1);
            period.EndDate = newerEndDate == DateTime.MinValue ? new DateTime(period.StartDate.Year, 12, 31) 
                                                               : new DateTime(newerEndDate.Year, 12, 31);

            return period;
        }
    }
}
