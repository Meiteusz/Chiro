using Chiro.Domain.Entities;

namespace Chiro.Domain.Interfaces
{
    public interface IAuthenticationTokenRepository
    {
        Task<bool> ExistsByTokenAsync(string token);
    }
}
