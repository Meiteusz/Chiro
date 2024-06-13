using System.ComponentModel.DataAnnotations;

namespace Chiro.Domain.DTOs
{
    public class ChangeProjectNameDTO
    {
        [Required(ErrorMessage = "O campo Id deve ser preenchido.")]
        public long Id { get; set; }

        [Required(ErrorMessage = "O campo Nome deve ser preenchido.")]
        public string Name { get; set; }
    }
}
