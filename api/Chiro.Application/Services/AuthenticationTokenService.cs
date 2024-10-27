using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Chiro.Application.Interfaces;
using Chiro.Domain.DTOs;
using Chiro.Domain.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace Chiro.Application.Services
{
    public class AuthenticationTokenService : IAuthenticationTokenService
    {
        private readonly IAuthenticationTokenRepository _repository;

        public AuthenticationTokenService(IAuthenticationTokenRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> AuthenticateAsync(AuthenticateDTO authenticateDTO)
        {
            var authenticated = await _repository.ExistsByTokenAsync(authenticateDTO.Token);
            if (!authenticated)
            {
                return string.Empty;
            }

            return GenerateJwtToken();
        }

        private string GenerateJwtToken()
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY")));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var Sectoken = new JwtSecurityToken(Environment.GetEnvironmentVariable("JWT_ISSUER"), Environment.GetEnvironmentVariable("JWT_ISSUER"), null,
              expires: DateTime.Now.AddMinutes(120),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(Sectoken);
        }
    }
}
