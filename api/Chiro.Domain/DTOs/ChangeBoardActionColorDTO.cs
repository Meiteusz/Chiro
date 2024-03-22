using System.ComponentModel.DataAnnotations;

namespace Chiro.Domain.DTOs
{
    public class ChangeBoardActionColorDTO
    {
        [Required(ErrorMessage = "O campo Id deve ser preenchido.")]
        public long Id { get; set; }

        [Required(ErrorMessage = "O campo Color deve ser preenchido.")]
        [RegularExpression("^(0x|0X)?[a-fA-F0-9]+$'", ErrorMessage = "Hexadecimal inválido para o campo Color.")]
        public string Color { get; set; }
    }
}