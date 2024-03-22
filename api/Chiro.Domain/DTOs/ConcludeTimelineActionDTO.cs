using System.ComponentModel.DataAnnotations;

namespace Chiro.Domain.DTOs
{
    public class ConcludeTimelineActionDTO
    {
        [Required(ErrorMessage = "O campo Id deve ser preenchido.")]
        public long Id { get; set; }
    }
}