namespace Chiro.Domain.Entities
{
    public class BoardActionLink
    {
        public long BaseBoardActionId { get; set; }
        public BoardAction BaseBoardAction { get; set; }

        public long LinkedBoardActionId { get; set; }
        public BoardAction LinkedBoardAction { get; set; }
    }
}
