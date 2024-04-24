using Chiro.Application.Interfaces;
using Chiro.Domain.DTOs;
using Chiro.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Chiro.Application.Services
{
    internal class UserService : IUserService
    {
        private readonly IUserRepository _repository;
        private readonly IConfiguration _configuration;

        public UserService(IUserRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
        }

        public Task<bool> CreateUserAsync(CreateUserDTO createUserDTO)
        {
            return _repository.CreateUserAsync(new Domain.Entities.User
            {
                FirstName = createUserDTO.FirstName,
                LastName = createUserDTO.LastName,
                Login = createUserDTO.Login,
                Password = createUserDTO.Password,
            });
        }

        public string Authenticate(AuthenticateDTO authenticateDTO)
        {
            var authenticated = _repository.ExistsUserByLoginAndPassword(authenticateDTO.Login, authenticateDTO.Password);
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

            var Sectoken = new JwtSecurityToken(_configuration["Jwt:Issuer"],
              _configuration["Jwt:Issuer"],
              null,
              expires: DateTime.Now.AddMinutes(120),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(Sectoken);
        }
    }
}
