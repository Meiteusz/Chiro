using Chiro.Domain.DTOs;

namespace Chiro.Infra.Interfaces
{
    public interface IProjectRepository
    {
        Task<List<Domain.Entities.Project>> GetProjectsAsync();

        Task<Domain.Entities.Project> GetProjectAsync(long projectId);

        Task<bool> CreateProjectAsync(Domain.Entities.Project project);
    }
}