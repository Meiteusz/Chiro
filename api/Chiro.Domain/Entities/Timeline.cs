namespace Chiro.Domain.Entities
{
    public class Timeline : BaseEntity
    {
        public List<TimelineAction> TimelineActions { get; set; }
    }
}