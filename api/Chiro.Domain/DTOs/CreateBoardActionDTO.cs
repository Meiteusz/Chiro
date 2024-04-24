using System.ComponentModel.DataAnnotations;

namespace Chiro.Domain.DTOs
{
    public class CreateBoardActionDTO
    {
        public long ProjectId { get; set; }
        public string Content { get; set; }
        public string Color { get; set; }
        public double PositionY { get; set; }
        public double PositionX { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }

        [Required(ErrorMessage = "O campo StartDate deve ser preenchido.")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "O campo EndDate deve ser preenchido.")]
        public DateTime EndDate { get; set; }
    }
}