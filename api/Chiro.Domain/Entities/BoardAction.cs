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
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? AdjustedDate { get; set; }
        public DateTime? ConcludedAt { get; set; }
        public BoardActionType BoardActionType { get; set; }

        public long ProjectId { get; set; }
        public Project Project { get; set; }

        public List<BoardActionLink> BoardActionLinks { get; set; }

        public void DelaySelfAndChilds()
        {
            var alreadyAdjustedActions = new List<long>();
            DelaySelf();
            alreadyAdjustedActions.Add(Id);

            if (BoardActionLinks is null || !BoardActionLinks.Any())
            {
                return;
            }

            foreach (var boardActionLink in BoardActionLinks)
            {
                if (alreadyAdjustedActions.Exists(w => w == boardActionLink.LinkedBoardActionId))
                {
                    continue;
                }

                boardActionLink.LinkedBoardAction.DelaySelf();
                alreadyAdjustedActions.Add(boardActionLink.LinkedBoardActionId);
            }
        }

        private void DelaySelf()
        {
            StartDate.AddDays(1);
            EndDate.AddDays(1);
        }
    }
}