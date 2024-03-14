namespace Chiro.Domain.Entities
{
    public class BoardAction : BaseEntity
    {
        public string Content { get; set; }
        public string Color { get; set; }
        public double PositionLeft { get; set; }
        public double PositionRight { get; set; }
        public double PositionTop { get; set; }
        public double PositionBottom { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
    }
}