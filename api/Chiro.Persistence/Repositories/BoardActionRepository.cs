using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;
using Chiro.Infra;
using Chiro.Infra.Interfaces;

namespace Chiro.Persistence.Repositories
{
    public class BoardActionRepository : IBoardActionRepository
    {
        public async Task<bool> CreateBoardActionAsync(CreateBoardActionDTO createBoardActionDTO)
        {
            using (var context = new ProjectContext())
            {
                await context.BoardActions.AddRangeAsync(new BoardAction
                {
                    Content = createBoardActionDTO.Content,
                    Color = createBoardActionDTO.Color,
                    Height = createBoardActionDTO.Height,
                    Width = createBoardActionDTO.Width,
                    PositionLeft = createBoardActionDTO.PositionLeft,
                    PositionRight = createBoardActionDTO.PositionRight,
                    PositionTop = createBoardActionDTO.PositionTop,
                    PositionBottom = createBoardActionDTO.PositionBottom,
                });

                return await context.SaveChangesAsync() > 0;
            }
        }

        public async Task<bool> ChangeColorAsync(ChangeBoardActionColorDTO changeBoardActionColorDTO)
        {
            using (var context = new ProjectContext())
            {
                return await context.BoardActions.Where(w => w.Id == changeBoardActionColorDTO.Id).UpdateFromQueryAsync(x => new BoardAction
                {
                    Color = changeBoardActionColorDTO.Color,
                }) > 0;
            }
        }

        public async Task<bool> ResizeAsync(ResizeBoardActionDTO resizeBoardActionDTO)
        {
            using (var context = new ProjectContext())
            {
                return await context.BoardActions.Where(w => w.Id == resizeBoardActionDTO.Id).UpdateFromQueryAsync(x => new BoardAction
                {
                    Width = resizeBoardActionDTO.Width,
                    Height = resizeBoardActionDTO.Height,
                }) > 0;
            }
        }

        public async Task<bool> MoveAsync(MoveBoardActionDTO moveBoardActionDTO)
        {
            using (var context = new ProjectContext())
            {
                return await context.BoardActions.Where(w => w.Id == moveBoardActionDTO.Id).UpdateFromQueryAsync(x => new BoardAction
                {
                    PositionLeft = moveBoardActionDTO.PositionLeft,
                    PositionRight = moveBoardActionDTO.PositionRight,
                    PositionTop = moveBoardActionDTO.PositionTop,
                    PositionBottom = moveBoardActionDTO.PositionBottom
                }) > 0;
            }
        }
    }
}