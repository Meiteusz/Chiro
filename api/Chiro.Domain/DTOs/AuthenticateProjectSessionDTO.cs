using System.ComponentModel.DataAnnotations;

namespace Chiro.Domain.DTOs
{
    public class AuthenticateProjectSessionDTO
    {
        [Required(ErrorMessage = "O campo Id deve ser preenchido.")]
        public long Id { get; set; }

        [Required(ErrorMessage = "O campo Password deve ser preenchido.")]
        public string Password { get; set; }
    }
}
