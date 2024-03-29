using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;

namespace Chiro.Application.Interfaces
{
    public interface IProjectServices
    {
        Task<bool> CreateProject(CreateProjectDTO createProjectDTO);

        Task<List<Project>> GetProjectsAsync();

        Task<Project?> GetProjectAsync(long projectId);

        Task<bool> AuthenticateProjectSessionAsync(AuthenticateProjectSessionDTO authenticateProjectSessionDTO);
    }
}