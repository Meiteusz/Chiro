using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;

namespace Chiro.Application.Interfaces
{
    public interface IProjectService
    {
        Task<bool> CreateProject(CreateProjectDTO createProjectDTO);

        Task<List<Project>> GetProjectsAsync();

        Task<Project?> GetProjectAsync(long projectId);

        Task<bool> AuthenticateProjectSessionAsync(AuthenticateProjectSessionDTO authenticateProjectSessionDTO);

        Task<bool> ResizeAsync(ResizeProjectDTO resizeProjectDTO);

        Task<bool> MoveAsync(MoveProjectDTO moveProjectDTO);

        Task<bool> ChangeColorAsync(ChangeProjectColorDTO changeProjectColorDTO);
    }
}