
using Chiro.Domain.Entities;
using Chiro.Infra;
using Chiro.Persistence.Repositories;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace Chiro.Persistence.Tests
{
    public class BoardActionRepositoryTests : IRepositoryTestBase
    {
        private ProjectContext _context;
        private BoardActionRepository _repository;

        [SetUp]
        public void Setup()
        {
            _context = CreateInMemoryDatabase();
            _repository = new BoardActionRepository(_context);
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Test]
        public async Task ChangePeriodAsync_ExistingBoardAction_ShouldChangeBoardActionPeriod()
        {
            // Arrange
            var newStartDate = DateTime.Now.AddDays(5);
            var newEndDate = DateTime.Now.AddDays(6);

            // Act
            var result = await _repository.ChangePeriodAsync(1, new BoardAction
            {
                StartDate = newStartDate,
                EndDate = newEndDate,
            });

            // Assert
            result.Should().BeTrue();

            var BoardAction = await _context.BoardActions.FirstAsync(w => w.Id == 1);
            await _context.Entry(BoardAction).ReloadAsync();

            BoardAction.Should().NotBeNull();
            BoardAction.StartDate.Should().Be(newStartDate);
            BoardAction.EndDate.Should().Be(newEndDate);
        }

        [Test]
        public async Task ChangePeriodAsync_NotExistingBoardAction_ShouldNotChangeBoardActionPeriod()
        {
            // Act
            var result = await _repository.ChangePeriodAsync(2, new BoardAction
            {
                StartDate = DateTime.Now.AddDays(5),
                EndDate = DateTime.Now.AddDays(6),
            });

            // Assert
            result.Should().BeFalse();

            var BoardAction = await _context.BoardActions.FirstOrDefaultAsync(w => w.Id == 2);
            BoardAction.Should().BeNull();
        }

        [Test]
        public async Task ConcludeBoardActionAsync_ExistingBoardAction_ShouldConcludeBoardAction()
        {
            // Arrange
            var concludedAt = DateTime.Now.AddDays(1);

            // Act
            var result = await _repository.ConcludeBoardActionAsync(1, new BoardAction
            {
                ConcludedAt = concludedAt
            });

            // Assert
            result.Should().BeTrue();

            var BoardAction = await _context.BoardActions.FirstAsync(w => w.Id == 1);
            await _context.Entry(BoardAction).ReloadAsync();
            BoardAction.Should().NotBeNull();

            BoardAction.ConcludedAt.Should().Be(concludedAt);
        }

        [Test]
        public async Task ConcludeBoardActionAsync_NotExistingBoardAction_ShouldNotConcludeBoardAction()
        {
            // Act
            var result = await _repository.ConcludeBoardActionAsync(2, new BoardAction
            {
                ConcludedAt = DateTime.Now.AddDays(1),
            });

            // Assert
            result.Should().BeFalse();

            var BoardAction = await _context.BoardActions.FirstOrDefaultAsync(w => w.Id == 2);
            BoardAction.Should().BeNull();
        }

        [Test]
        public async Task CreateBoardActionAsync_ValidBoardAction_ShouldCreateBoardAction()
        {
            // Arrange
            var startDate = DateTime.Now;
            var endDate = DateTime.Now.AddDays(1);
            var color = "#FFF";
            var content = "Content";

            var dbOptions = new DbContextOptionsBuilder<ProjectContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString());

            using (var context = new ProjectContext(dbOptions.Options))
            {
                var repository = new BoardActionRepository(context);
                var result = await repository.CreateBoardActionAsync(new BoardAction
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Color = color,
                    Content = content
                });

                result.Should().BeTrue();
                var BoardAction = await context.BoardActions.FirstAsync();

                BoardAction.Should().NotBeNull();
                BoardAction.Id.Should().Be(1);
                BoardAction.StartDate.Should().Be(startDate);
                BoardAction.EndDate.Should().Be(endDate);
                BoardAction.Content.Should().Be(content);
                BoardAction.Color.Should().Be(color);
            }
        }

        [Test]
        public async Task ChangeColorAsync_ExistingBoardAction_ShouldChangeColor()
        {
            // Arrange
            var newColor = "#GGG";
            var boardActionId = 1;

            // Act
            var result = await _repository.ChangeColorAsync(boardActionId, new BoardAction
            {
                Color = newColor
            });

            // Assert
            result.Should().BeTrue();

            var boardAction = await _context.BoardActions.FirstAsync(w => w.Id == boardActionId);
            await _context.Entry(boardAction).ReloadAsync();
            boardAction.Should().NotBeNull();
            boardAction.Color.Should().Be(newColor);
        }

        [Test]
        public async Task ChangeColorAsync_NotExistingBoardAction_ShouldNotChangeColor()
        {
            // Arrange
            var newColor = "#GGG";
            var nonExistingBoardActionId = 2;

            // Act
            var result = await _repository.ChangeColorAsync(nonExistingBoardActionId, new BoardAction
            {
                Color = newColor
            });

            // Assert
            result.Should().BeFalse();

            var boardAction = await _context.BoardActions.FirstOrDefaultAsync(w => w.Id == nonExistingBoardActionId);
            boardAction.Should().BeNull();
        }

        [Test]
        public async Task ResizeAsync_ExistingBoardAction_ShouldResize()
        {
            // Arrange
            var newWidth = 200;
            var newHeight = 100;
            var boardActionId = 1;

            // Act
            var result = await _repository.ResizeAsync(boardActionId, new BoardAction
            {
                Width = newWidth,
                Height = newHeight
            });

            // Assert
            result.Should().BeTrue();

            var boardAction = await _context.BoardActions.FirstAsync(w => w.Id == boardActionId);
            await _context.Entry(boardAction).ReloadAsync();
            boardAction.Should().NotBeNull();
            boardAction.Width.Should().Be(newWidth);
            boardAction.Height.Should().Be(newHeight);
        }

        [Test]
        public async Task ResizeAsync_NotExistingBoardAction_ShouldNotResize()
        {
            // Arrange
            var newWidth = 200;
            var newHeight = 100;
            var nonExistingBoardActionId = 2;

            // Act
            var result = await _repository.ResizeAsync(nonExistingBoardActionId, new BoardAction
            {
                Width = newWidth,
                Height = newHeight
            });

            // Assert
            result.Should().BeFalse();

            var boardAction = await _context.BoardActions.FirstOrDefaultAsync(w => w.Id == nonExistingBoardActionId);
            boardAction.Should().BeNull();
        }

        [Test]
        public async Task MoveAsync_ExistingBoardAction_ShouldMove()
        {
            // Arrange
            var newPositionX = 300;
            var newPositionY = 150;
            var boardActionId = 1;

            // Act
            var result = await _repository.MoveAsync(boardActionId, new BoardAction
            {
                PositionX = newPositionX,
                PositionY = newPositionY
            });

            // Assert
            result.Should().BeTrue();

            var boardAction = await _context.BoardActions.FirstAsync(w => w.Id == boardActionId);
            await _context.Entry(boardAction).ReloadAsync();
            boardAction.Should().NotBeNull();
            boardAction.PositionX.Should().Be(newPositionX);
            boardAction.PositionY.Should().Be(newPositionY);
        }

        [Test]
        public async Task MoveAsync_NotExistingBoardAction_ShouldNotMove()
        {
            // Arrange
            var newPositionX = 300;
            var newPositionY = 150;
            var nonExistingBoardActionId = 2;

            // Act
            var result = await _repository.MoveAsync(nonExistingBoardActionId, new BoardAction
            {
                PositionX = newPositionX,
                PositionY = newPositionY
            });

            // Assert
            result.Should().BeFalse();

            var boardAction = await _context.BoardActions.FirstOrDefaultAsync(w => w.Id == nonExistingBoardActionId);
            boardAction.Should().BeNull();
        }

        [Test]
        public async Task GetBoardActionsByProjectId_ProjectWithExistingBoardActions_ShouldReturnBoardActions()
        {
            // Arrange
            var project = _context.Projects.First();

            // Act
            var result = _repository.GetBoardActionsByProjectId(project.Id);

            // Assert
            result.Should().NotBeNull();
            result.All(s => s.ProjectId == project.Id).Should().BeTrue();
        }

        [Test]
        public async Task GetBoardActionsByProjectId_ProjectWithNoBoardActions_ShouldReturnEmptyList()
        {
            // Arrange
            var projectId = 1000;

            // Act
            var result = _repository.GetBoardActionsByProjectId(projectId);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEmpty();
        }

        [Test]
        public async Task GetBoardActionByProjectId_ProjectWithExistingBoardActions_ShouldReturnBoardActions()
        {
            // Arrange
            var project = _context.Projects.First();

            // Act
            var result = _repository.GetBoardActionByProjectId(project.Id);

            // Assert
            result.Should().NotBeNull();
            result.All(s => s.ProjectId == project.Id).Should().BeTrue();
        }

        [Test]
        public async Task GetBoardActionByProjectId_ProjectWithNoBoardActions_ShouldReturnEmptyList()
        {
            // Arrange
            var projectId = 1000;

            // Act
            var result = _repository.GetBoardActionByProjectId(projectId);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEmpty();
        }

        [Test]
        public async Task LinkAsync_ValidBoardActionLink_ShouldReturnTrueAndAddLink()
        {
            // Arrange
            var boardActionLink = new BoardActionLink
            {
                BaseBoardActionId = 1,
                LinkedBoardActionId = 2,
            };

            // Act
            var result = await _repository.LinkAsync(boardActionLink);

            // Assert
            result.Should().BeTrue();

            var addedLink = await _context.BoardActionLinks.FirstOrDefaultAsync(link =>
                link.BaseBoardActionId == boardActionLink.BaseBoardActionId &&
                link.LinkedBoardActionId == boardActionLink.LinkedBoardActionId);

            addedLink.Should().NotBeNull();
            addedLink.BaseBoardActionId.Should().Be(boardActionLink.BaseBoardActionId);
            addedLink.LinkedBoardActionId.Should().Be(boardActionLink.LinkedBoardActionId);
        }

        [Test]
        public async Task LinkAsync_InvalidBoardActionLink_ShouldReturnFalse()
        {
            // Arrange
            var invalidBoardActionLink = new BoardActionLink
            {
                BaseBoardActionId = 0,
                LinkedBoardActionId = 0,
            };

            // Act
            Func<Task> act = async () => { await _repository.LinkAsync(invalidBoardActionLink); };

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>();

            var addedLink = await _context.BoardActionLinks.FirstOrDefaultAsync(link =>
                link.BaseBoardActionId == invalidBoardActionLink.BaseBoardActionId &&
                link.LinkedBoardActionId == invalidBoardActionLink.LinkedBoardActionId);

            addedLink.Should().BeNull();
        }

        public ProjectContext CreateInMemoryDatabase()
        {
            var dbOptions = new DbContextOptionsBuilder<ProjectContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString());

            _context = new ProjectContext(dbOptions.Options);
            _context.BoardActions.Add(new BoardAction
            {
                StartDate = DateTime.Now.AddDays(-1),
                EndDate = DateTime.Now.AddDays(1),
                Color = "#FFF",
                Content = "Action",
                Project = new Project
                {
                    Color = "#FFF",
                    Name = "Project",
                    Password = "Password"
                }
            });
            _context.SaveChanges();

            return _context;
        }
    }
}