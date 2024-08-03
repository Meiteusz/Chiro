using System.ComponentModel.DataAnnotations;

namespace Chiro.Domain.DTOs
{
    public class ConcludeBoardActionDTO
    {
        [Required(ErrorMessage = "O campo Id deve ser preenchido.")]
        public long Id { get; set; }

        [Required(ErrorMessage = "O campo EndDate deve ser preenchido.")]
        public DateTime EndDate { get; set; }
    }
}