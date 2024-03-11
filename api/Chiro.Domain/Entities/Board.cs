namespace Chiro.Domain.Entities
{
    public class Board : BaseEntity
    {
        public List<BoardAction> BoardActions { get; set; }
    }
}