using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;

namespace Chiro.Application.Interfaces
{
    public interface IProjectService
    {
        Task<long> CreateProject(CreateProjectDTO createProjectDTO);

        Task<List<Project>> GetProjectsAsync();

        Task<Project?> GetProjectAsync(long projectId);

        Task<bool> ResizeAsync(ResizeProjectDTO resizeProjectDTO);

        Task<bool> MoveAsync(MoveProjectDTO moveProjectDTO);

        Task<bool> ChangeColorAsync(ChangeProjectColorDTO changeProjectColorDTO);

        Task<List<Project>> GetProjectsWithActionsAsync();

        Task<Project?> GetDelayedProjectAsync(long projectId);

        Task<bool> DeleteAsync(long projectId);

        Task<bool> ChangeNameAsync(ChangeProjectNameDTO changeProjectNameDTO);

        Task<TimelinePeriodDTO> GetTimelinePeriodAsync(long projectId);

        Task<string> GetProjectNameAsync(long projectId);

        Task<int> GetBiggestTimelineRow(long projectId);
    }
}