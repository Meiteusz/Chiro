using Chiro.Domain.DTOs;

namespace Chiro.Application.Interfaces
{
    public interface IAuthenticationTokenService
    {
        Task<string> AuthenticateAsync(AuthenticateDTO authenticateDTO);
    }
}