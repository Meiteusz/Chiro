using System.ComponentModel.DataAnnotations;

namespace Chiro.Domain.DTOs
{
    public class CreateTimelineActionDTO
    {
        [Required(ErrorMessage = "O campo BoardActionId deve ser preenchido.")]
        public long BoardActionId { get; set; }

        [Required(ErrorMessage = "O campo StartDate deve ser preenchido.")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "O campo EndDate deve ser preenchido.")]
        public DateTime EndDate { get; set; }
    }
}