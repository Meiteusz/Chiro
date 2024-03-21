namespace Chiro.Domain.Interfaces
{
    public interface IProjectRepository
    {
        Task<List<Entities.Project>> GetProjectsAsync();

        Task<Entities.Project> GetProjectAsync(long projectId);

        Task<bool> CreateProjectAsync(Entities.Project project);
    }
}