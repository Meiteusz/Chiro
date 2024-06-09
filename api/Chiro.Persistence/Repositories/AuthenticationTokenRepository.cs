using Chiro.Domain.Interfaces;
using Chiro.Infra;
using Microsoft.EntityFrameworkCore;

namespace Chiro.Persistence.Repositories
{
    public class AuthenticationTokenRepository : IAuthenticationTokenRepository
    {
        private readonly ProjectContext _context;

        public AuthenticationTokenRepository(ProjectContext context)
        {
            _context = context;
        }

        public async Task<bool> ExistsByTokenAsync(string token)
        {
            return await _context.AuthenticationTokens.AnyAsync(w => w.Token == token);
        }
    }
}
