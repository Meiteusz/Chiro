namespace Chiro.Domain.Entities
{
    public class BoardAction : BaseEntity
    {
        public long ProjectId { get; set; }
        public string Content { get; set; }
        public string Color { get; set; }
        public double PositionY { get; set; }
        public double PositionX { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
    }
}