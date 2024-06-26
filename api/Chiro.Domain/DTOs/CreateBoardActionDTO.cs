using Chiro.Domain.Enums;
using Newtonsoft.Json;

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
        public BoardActionType BoardActionType { get; set; }

        [JsonProperty("startsDate")]
        public DateTime? StartDate { get; set; }

        [JsonProperty("endsDate")]
        public DateTime? EndDate { get; set; }
    }
}