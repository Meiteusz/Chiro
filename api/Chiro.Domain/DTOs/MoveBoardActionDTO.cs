using System.ComponentModel.DataAnnotations;

namespace Chiro.Domain.DTOs
{
    public class MoveBoardActionDTO
    {
        public long Id { get; set; }
        public double PositionY { get; set; }
        public double PositionX { get; set; }
    }
}