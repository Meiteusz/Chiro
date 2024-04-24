namespace Chiro.Domain.Entities
{
    public class Project : BaseEntity
    {
        public string Password { get; set; }
        public string Name { get; set; }
        public double PositionY { get; set; }
        public double PositionX { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public string Color { get; set; }

        public List<BoardAction> BoardActions { get; set; }
    }
}