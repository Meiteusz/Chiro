namespace Chiro.Domain.Entities
{
    public class Project : BaseEntity
    {
        public string Password { get; set; }
        public string Name { get; set; }

        public long TimelineId { get; set; }
        public Timeline Timeline { get; set; }

        public long BoardId { get; set; }
        public Board Board { get; set; }
    }
}