using Chiro.Domain.DTOs;

namespace Chiro.Application.Interfaces
{
    public interface IUserService
    {
        Task<bool> CreateUserAsync(CreateUserDTO createUserDTO);

        string Authenticate(AuthenticateDTO authenticateDTO);
    }
}