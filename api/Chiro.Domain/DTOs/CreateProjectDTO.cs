using System.ComponentModel.DataAnnotations;

namespace Chiro.Domain.DTOs
{
    public class CreateProjectDTO
    {
        [Required(ErrorMessage = "O campo Name deve ser preenchido.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "O campo Password deve ser preenchido.")]
        public string Password { get; set; }
    }
}   