using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;
using Chiro.Infra;

namespace Chiro.Persistence.Repositories
{
    internal class UserRepository : IUserRepository
    {
        private readonly ProjectContext _context;

        public UserRepository(ProjectContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            return await _context.SaveChangesAsync() > 0;
        }

        public bool ExistsUserByLoginAndPassword(string login, string password)
        {
            return _context.Users.Any(w => w.Login == login && w.Password == password);
        }
    }
}
