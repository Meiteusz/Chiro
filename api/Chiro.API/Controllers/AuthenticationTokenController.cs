using Chiro.Application.Interfaces;
using Chiro.Domain.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chiro.API.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthenticationTokenController : ControllerBase
    {
        private readonly IAuthenticationTokenService _authenticationTokenService;

        public AuthenticationTokenController(IAuthenticationTokenService authenticationTokenService)
        {
            _authenticationTokenService = authenticationTokenService;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] AuthenticateDTO authenticateDTO)
        {
            var token = await _authenticationTokenService.AuthenticateAsync(authenticateDTO);
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Token incorreto.");
            }

            return Ok(token);
        }
    }
}