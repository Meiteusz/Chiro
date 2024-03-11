namespace Chiro.Domain.DTOs
{
    public class CreateTimelineActionDTO
    {
        public long BoardActionId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}