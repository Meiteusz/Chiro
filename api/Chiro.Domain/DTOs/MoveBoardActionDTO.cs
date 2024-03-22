using System.ComponentModel.DataAnnotations;

namespace Chiro.Domain.DTOs
{
    public class MoveBoardActionDTO
    {
        public long Id { get; set; }
        public double PositionLeft { get; set; }
        public double PositionRight { get; set; }
        public double PositionTop { get; set; }
        public double PositionBottom { get; set; }
    }
}