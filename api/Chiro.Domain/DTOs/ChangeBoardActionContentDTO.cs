using System.ComponentModel.DataAnnotations;

namespace Chiro.Domain.DTOs
{
    public class ChangeBoardActionContentDTO
    {
        [Required(ErrorMessage = "O campo Id deve ser preenchido.")]
        public long Id { get; set; }

        [Required(ErrorMessage = "O campo Content deve ser preenchido.")]
        public string Content { get; set; }
    }
}
