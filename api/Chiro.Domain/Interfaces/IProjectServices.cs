using Chiro.Domain.DTOs;

namespace Chiro.Domain.Interfaces
{
    public interface IProjectServices
    {
        Task<bool> CreateProject(CreateProjectDTO createProjectDTO);
        Task<List<Domain.Entities.Project>> GetProjects();
        Task<Domain.Entities.Project> GetProject(long projectId);
    }
}
