using Chiro.Application.Interfaces;
using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;

namespace Chiro.Application.Services
{
    public class BoardActionService : IBoardActionService
    {
        private readonly IBoardActionRepository _repository;
        private readonly IProjectService _projectService;

        public BoardActionService(IBoardActionRepository boardActionRepository, IProjectService projectService)
        {
            _repository = boardActionRepository;
            _projectService = projectService;
        }

        #region Public Methods

        public async Task<bool> ChangeColorAsync(ChangeBoardActionColorDTO changeBoardActionColorDTO)
        {
            ArgumentNullException.ThrowIfNull(changeBoardActionColorDTO);

            return await _repository.ChangeColorAsync(changeBoardActionColorDTO.Id, new BoardAction
            {
                Color = changeBoardActionColorDTO.Color,
            });
        }

        public async Task<long> CreateBoardActionAsync(CreateBoardActionDTO createBoardActionDTO)
        {
            ArgumentNullException.ThrowIfNull(createBoardActionDTO);

            return await _repository.CreateBoardActionAsync(new BoardAction
            {
                ProjectId = createBoardActionDTO.ProjectId,
                Content = createBoardActionDTO.Content,
                Color = createBoardActionDTO.Color,
                Height = createBoardActionDTO.Height,
                Width = createBoardActionDTO.Width,
                PositionX = createBoardActionDTO.PositionX,
                PositionY = createBoardActionDTO.PositionY,
                StartDate = createBoardActionDTO.StartDate,
                EndDate = createBoardActionDTO.EndDate,
                BoardActionType = createBoardActionDTO.BoardActionType
            });
        }

        public async Task<bool> MoveAsync(MoveBoardActionDTO moveBoardActionDTO)
        {
            ArgumentNullException.ThrowIfNull(moveBoardActionDTO);

            return await _repository.MoveAsync(moveBoardActionDTO.Id, new BoardAction
            {
                PositionX = moveBoardActionDTO.PositionX,
                PositionY = moveBoardActionDTO.PositionY
            });
        }

        public async Task<bool> ResizeAsync(ResizeBoardActionDTO resizeBoardActionDTO)
        {
            ArgumentNullException.ThrowIfNull(resizeBoardActionDTO);

            return await _repository.ResizeAsync(resizeBoardActionDTO.Id, new BoardAction
            {
                Width = resizeBoardActionDTO.Width,
                Height = resizeBoardActionDTO.Height,
                PositionX = resizeBoardActionDTO.PositionX,
                PositionY = resizeBoardActionDTO.PositionY
            });
        }

        public async Task<bool> ChangePeriodAsync(ChangePeriodDTO changePeriodDTO)
        {
            ArgumentNullException.ThrowIfNull(changePeriodDTO);

            return await _repository.ChangePeriodAsync(changePeriodDTO.Id, new BoardAction
            {
                StartDate = changePeriodDTO.StartDate,
                EndDate = changePeriodDTO.EndDate,
                TimelineRow = changePeriodDTO.TimelineRow
            });
        }

        public async Task<bool> ConcludeBoardActionAsync(ConcludeBoardActionDTO concludeBoardActionDTO)
        {
            ArgumentNullException.ThrowIfNull(concludeBoardActionDTO);

            return await _repository.ConcludeBoardActionAsync(concludeBoardActionDTO.Id, new BoardAction
            {
                ConcludedAt = DateTime.Now,
                EndDate = concludeBoardActionDTO.EndDate
            });
        }

        public async Task<bool> LinkAsync(LinkBoardActionDTO linkBoardActionDTO)
        {
            ArgumentNullException.ThrowIfNull(linkBoardActionDTO);

            return await _repository.LinkAsync(new BoardActionLink
            {
                BaseBoardActionId = linkBoardActionDTO.BaseBoardActionId,
                LinkedBoardActionId = linkBoardActionDTO.LinkedBoardActionId
            });
        }

        public async Task DelayBoardActionsFromProjectAsync(long projectId)
        {
            var project = await _projectService.GetProjectAsync(projectId);
            if (!ShouldDelayBoardActions(project))
            {
                return;
            }

            var alreadyDelayedActions = new List<long>();
            foreach (var boardAction in project.BoardActions.Where(w => w.EndDate < DateTime.Now && w.ConcludedAt == null))
            {
                if (alreadyDelayedActions.Exists(w => w == boardAction.Id))
                {
                    continue;
                }

                alreadyDelayedActions.AddRange(boardAction.DelaySelfAndChilds());
            }

            await _repository.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(long boardActionId)
        {
            ArgumentOutOfRangeException.ThrowIfNegativeOrZero(boardActionId);

            return await _repository.DeleteAsync(boardActionId);
        }

        public async Task<bool> ChangeContentAsync(ChangeBoardActionContentDTO changeBoardActionContentDTO)
        {
            ArgumentNullException.ThrowIfNull(changeBoardActionContentDTO);

            return await _repository.ChangeContentAsync(changeBoardActionContentDTO.Id, new BoardAction
            {
                Content = changeBoardActionContentDTO.Content,
            });
        }

        #endregion

        #region Private Methods

        private static bool ShouldDelayBoardActions(Project project)
        {
            if (project is null)
            {
                return false;
            }

            if (project.BoardActions == null || project.BoardActions.Count == 0)
            {
                return false;
            }

            if (!project.BoardActions.Any(w => w.EndDate < DateTime.Now && w.ConcludedAt == null))
            {
                return false;
            }

            return true;
        }

        #endregion
    }
}
