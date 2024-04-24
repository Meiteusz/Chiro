using Chiro.Domain.Entities;

namespace Chiro.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task<bool> CreateUserAsync(User user);
        bool ExistsUserByLoginAndPassword(string login, string password);
    }
}
