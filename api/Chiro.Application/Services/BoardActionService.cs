using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;
using Chiro.Infra.Interfaces;

namespace Chiro.Domain.Services
{
    public class BoardActionService : IBoardActionServices
    {
        private readonly IBoardActionRepository _boardActionRepository;
        public BoardActionService(IBoardActionRepository boardActionRepository)
        {
            _boardActionRepository = boardActionRepository;
        }

        public async Task<bool> ChangeColor(ChangeBoardActionColorDTO changeBoardActionColorDTO)
        {
            var boardAction = new BoardAction
            {
                Id = changeBoardActionColorDTO.Id,
                Color = changeBoardActionColorDTO.Color,
            };

            return await _boardActionRepository.ChangeColorAsync(boardAction);
        }

        public async Task<bool> CreateBoardAction(CreateBoardActionDTO createBoardActionDTO)
        {
            var boardAction = new BoardAction
            {
                Content = createBoardActionDTO.Content,
                Color = createBoardActionDTO.Color,
                Height = createBoardActionDTO.Height,
                Width = createBoardActionDTO.Width,
                PositionLeft = createBoardActionDTO.PositionLeft,
                PositionRight = createBoardActionDTO.PositionRight,
                PositionTop = createBoardActionDTO.PositionTop,
                PositionBottom = createBoardActionDTO.PositionBottom
            };

            return await _boardActionRepository.CreateBoardActionAsync(boardAction);
        }

        public async Task<bool> Move(MoveBoardActionDTO moveBoardActionDTO)
        {
            var boardAction = new BoardAction
            {
                Id = moveBoardActionDTO.Id,
                PositionLeft = moveBoardActionDTO.PositionLeft,
                PositionRight = moveBoardActionDTO.PositionRight,
                PositionBottom = moveBoardActionDTO.PositionBottom,
                PositionTop = moveBoardActionDTO.PositionTop,
            };

            return await _boardActionRepository.MoveAsync(boardAction);
        }

        public async Task<bool> Resize(ResizeBoardActionDTO resizeBoardActionDTO)
        {
            var boardAction = new BoardAction
            {
                Id = resizeBoardActionDTO.Id,
                Width = resizeBoardActionDTO.Width,
                Height = resizeBoardActionDTO.Height,
            };

            return await _boardActionRepository.ResizeAsync(boardAction);
        }
    }
}
