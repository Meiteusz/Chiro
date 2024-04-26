using Chiro.Application.Interfaces;
using Chiro.Domain.DTOs;
using Chiro.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Chiro.Application.Services
{
    public class AuthenticationTokenService : IAuthenticationTokenService
    {
        private readonly IAuthenticationTokenRepository _repository;
        private readonly IConfiguration _configuration;

        public AuthenticationTokenService(IAuthenticationTokenRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
        }

        public async Task<string> Authenticate(AuthenticateDTO authenticateDTO)
        {
            var authenticated = await _repository.ExistsByToken(authenticateDTO.Token);
            if (!authenticated)
            {
                return string.Empty;
            }

            return GenerateJwtToken();
        }

        private string GenerateJwtToken()
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var Sectoken = new JwtSecurityToken(_configuration["Jwt:Issuer"], _configuration["Jwt:Issuer"], null,
              expires: DateTime.Now.AddMinutes(120),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(Sectoken);
        }
    }
}
