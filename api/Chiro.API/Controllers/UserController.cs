using Chiro.Application.Interfaces;
using Chiro.Domain.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chiro.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/user")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] AuthenticateDTO logInDTO)
        {
            var token = _userService.Authenticate(logInDTO);
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Credenciais erradas.");
            }

            return Ok(token);
        }
    }
}