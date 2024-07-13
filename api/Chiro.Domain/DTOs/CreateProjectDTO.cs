using System.ComponentModel.DataAnnotations;

namespace Chiro.Domain.DTOs
{
    public class CreateProjectDTO
    {
        public string Name { get; set; }

        [Required(ErrorMessage = "O campo Password deve ser preenchido.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "O campo PositionY deve ser preenchido.")]
        public double PositionY { get; set; }

        [Required(ErrorMessage = "O campo PositionX deve ser preenchido.")]
        public double PositionX { get; set; }

        [Required(ErrorMessage = "O campo Width deve ser preenchido.")]
        public double Width { get; set; }

        [Required(ErrorMessage = "O campo Height deve ser preenchido.")]
        public double Height { get; set; }

        [Required(ErrorMessage = "O campo Color deve ser preenchido.")]
        public string Color { get; set; }
    }
}