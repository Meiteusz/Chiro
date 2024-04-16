using Chiro.Domain.Entities;

namespace Chiro.Domain.Interfaces
{
    public interface IProjectRepository
    {
        Task<List<Entities.Project>> GetProjectsAsync();

        Task<Entities.Project?> GetProjectAsync(long projectId);

        Task<bool> CreateProjectAsync(Entities.Project project);

        Task<bool> AuthenticateProjectSessionAsync(long projectId, string password);

        Task<bool> ResizeAsync(long projectId, Project project);

        Task<bool> MoveAsync(Project project);

        Task<bool> ChangeColorAsync(Project project);
    }
}