using Chiro.Domain.Entities;

namespace Chiro.Domain.Interfaces
{
    public interface IProjectRepository
    {
        Task<List<Entities.Project>> GetProjectsAsync();

        Task<Entities.Project?> GetProjectAsync(long projectId);

        Task<long> CreateProjectAsync(Entities.Project project);

        Task<bool> ResizeAsync(long projectId, Project project);

        Task<bool> MoveAsync(Project project);

        Task<bool> ChangeColorAsync(Project project);

        Task<List<Project>> GetProjectsWithActionsAsync();

        Task<bool> DeleteAsync(long projectId);

        Task<bool> ChangeNameAsync(long projectId, Project project);
    }
}