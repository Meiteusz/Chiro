using Chiro.Domain.Enums;

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
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? AdjustedDate { get; set; }
        public DateTime? ConcludedAt { get; set; }
        public BoardActionType BoardActionType { get; set; }
        public int? TimelineRow { get; set; }

        public long ProjectId { get; set; }
        public Project Project { get; set; }

        public List<BoardActionLink> BoardActionLinks { get; set; }

        public IEnumerable<long> DelaySelfAndChilds()
        {
            var alreadyAdjustedActions = new List<long>
            {
                Delay()
            };

            if (BoardActionLinks is null || BoardActionLinks.Count == 0)
            {
                return Enumerable.Empty<long>();
            }

            foreach (var boardActionLink in BoardActionLinks)
            {
                if (alreadyAdjustedActions.Contains(boardActionLink.LinkedBoardActionId))
                {
                    continue;
                }

                alreadyAdjustedActions.Add(boardActionLink.LinkedBoardAction.Delay());
            }

            return alreadyAdjustedActions;
        }

        public long Delay()
        {
            if (StartDate.HasValue)
            {
                StartDate = StartDate.Value.AddDays(1);
            }

            if (EndDate.HasValue)
            {
                EndDate = EndDate.Value.AddDays(1);
            }

            return Id;
        }
    }
}