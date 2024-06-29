using System.ComponentModel.DataAnnotations;

namespace Chiro.Domain.DTOs
{
    public class ChangePeriodDTO
    {
        [Required(ErrorMessage = "O campo Id deve ser preenchido.")]
        public long Id { get; set; }

        [Required(ErrorMessage = "O campo StartDate deve ser preenchido.")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "O campo EndDate deve ser preenchido.")]
        public DateTime EndDate { get; set; }

        [Required(ErrorMessage = "O campo TimelineRow deve ser preenchido.")]
        public int TimelineRow { get; set; }
    }
}