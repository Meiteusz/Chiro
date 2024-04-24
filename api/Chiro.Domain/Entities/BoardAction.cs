namespace Chiro.Domain.Entities
{
    public class BoardAction : BaseEntity
    {
        public string Content { get; set; }
        public string Color { get; set; }
        public double PositionY { get; set; }
        public double PositionX { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? AdjustedDate { get; set; }
        public DateTime? ConcludedAt { get; set; }

        public long ProjectId { get; set; }
        public Project Project { get; set; }
    }
}