using Chiro.Application.Interfaces;
using Chiro.Application.Services;
using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;
using Chiro.Domain.Enums;
using Chiro.Domain.Interfaces;
using FluentAssertions;
using Moq;

namespace Chiro.Application.Tests
{
    public class BoardActionServiceTests
    {
        private BoardActionService _service;
        private Mock<IBoardActionRepository> _repositoryMock;
        private Mock<IProjectService> _projectServiceMock;

        [SetUp]
        public void Setup()
        {
            _repositoryMock = new Mock<IBoardActionRepository>();
            _projectServiceMock = new Mock<IProjectService>();

            _service = new BoardActionService(_repositoryMock.Object, _projectServiceMock.Object);
        }

        [Test]
        public async Task ChangeColorAsync_ChangeBoardActionColorDtoNotNull_ShouldChangeColor()
        {
            // Arrange
            var changeBoardActionColorDto = new ChangeBoardActionColorDTO
            {
                Id = 1,
                Color = "#FFF"
            };

            BoardAction? changedBoardAction = null;
            _repositoryMock.Setup(s => s.ChangeColorAsync(It.IsAny<long>(), It.IsAny<BoardAction>()))
                .ReturnsAsync(true)
                .Callback<long, BoardAction>((id, boardAction) => changedBoardAction = boardAction);

            // Act
            var result = await _service.ChangeColorAsync(changeBoardActionColorDto);

            // Assert
            result.Should().BeTrue();
            changedBoardAction.Should().NotBeNull();
            changedBoardAction.Color.Should().Be(changeBoardActionColorDto.Color);
        }

        [Test]
        public async Task ChangeColorAsync_ChangeBoardActionColorDtoNull_ShouldThrowException()
        {
            // Act
            Func<Task> action = async () => await _service.ChangeColorAsync(null);

            // Assert
            await action.Should().ThrowAsync<ArgumentNullException>();
        }

        [Test]
        public async Task CreateBoardActionAsync_CreateBoardActionDtoNotNull_ShouldCreateBoardAction()
        {
            // Arrange
            var createBoardActionDto = new CreateBoardActionDTO
            {
                ProjectId = 1,
                Content = "Test Content",
                Color = "#FFF",
                Height = 100,
                Width = 200,
                PositionX = 10,
                PositionY = 20,
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddDays(1),
                BoardActionType = BoardActionType.Player
            };

            BoardAction? createdBoardAction = null;
            _repositoryMock.Setup(s => s.CreateBoardActionAsync(It.IsAny<BoardAction>()))
                .ReturnsAsync(1)
                .Callback<BoardAction>(boardAction => createdBoardAction = boardAction);

            // Act
            var result = await _service.CreateBoardActionAsync(createBoardActionDto);

            // Assert
            result.Should().BeGreaterThan(0);
            createdBoardAction.Should().NotBeNull();
            createdBoardAction.ProjectId.Should().Be(createBoardActionDto.ProjectId);
            createdBoardAction.Content.Should().Be(createBoardActionDto.Content);
            createdBoardAction.Color.Should().Be(createBoardActionDto.Color);
            createdBoardAction.Height.Should().Be(createBoardActionDto.Height);
            createdBoardAction.Width.Should().Be(createBoardActionDto.Width);
            createdBoardAction.PositionX.Should().Be(createBoardActionDto.PositionX);
            createdBoardAction.PositionY.Should().Be(createBoardActionDto.PositionY);
            createdBoardAction.StartDate.Should().Be(createBoardActionDto.StartDate);
            createdBoardAction.EndDate.Should().Be(createBoardActionDto.EndDate);
            createdBoardAction.BoardActionType.Should().Be(createBoardActionDto.BoardActionType);
        }

        [Test]
        public async Task CreateBoardActionAsync_CreateBoardActionDtoNull_ShouldThrowException()
        {
            // Act
            Func<Task> action = async () => await _service.CreateBoardActionAsync(null);

            // Assert
            await action.Should().ThrowAsync<ArgumentNullException>();
        }

        [Test]
        public async Task MoveAsync_MoveBoardActionDtoNotNull_ShouldMoveBoardAction()
        {
            // Arrange
            var moveBoardActionDto = new MoveBoardActionDTO
            {
                Id = 1,
                PositionX = 100,
                PositionY = 200
            };

            BoardAction? movedBoardAction = null;
            _repositoryMock.Setup(s => s.MoveAsync(It.IsAny<long>(), It.IsAny<BoardAction>()))
                .ReturnsAsync(true)
                .Callback<long, BoardAction>((id, boardAction) => movedBoardAction = boardAction);

            // Act
            var result = await _service.MoveAsync(moveBoardActionDto);

            // Assert
            result.Should().BeTrue();
            movedBoardAction.Should().NotBeNull();
            movedBoardAction.PositionX.Should().Be(moveBoardActionDto.PositionX);
            movedBoardAction.PositionY.Should().Be(moveBoardActionDto.PositionY);
        }

        [Test]
        public async Task MoveAsync_MoveBoardActionDtoNull_ShouldThrowException()
        {
            // Act
            Func<Task> action = async () => await _service.MoveAsync(null);

            // Assert
            await action.Should().ThrowAsync<ArgumentNullException>();
        }

        [Test]
        public async Task ResizeAsync_ResizeBoardActionDtoNotNull_ShouldResizeBoardAction()
        {
            // Arrange
            var resizeBoardActionDto = new ResizeBoardActionDTO
            {
                Id = 1,
                Width = 300,
                Height = 400
            };

            BoardAction? resizedBoardAction = null;
            _repositoryMock.Setup(s => s.ResizeAsync(It.IsAny<long>(), It.IsAny<BoardAction>()))
                .ReturnsAsync(true)
                .Callback<long, BoardAction>((id, boardAction) => resizedBoardAction = boardAction);

            // Act
            var result = await _service.ResizeAsync(resizeBoardActionDto);

            // Assert
            result.Should().BeTrue();
            resizedBoardAction.Should().NotBeNull();
            resizedBoardAction.Width.Should().Be(resizeBoardActionDto.Width);
            resizedBoardAction.Height.Should().Be(resizeBoardActionDto.Height);
        }

        [Test]
        public async Task ResizeAsync_ResizeBoardActionDtoNull_ShouldThrowException()
        {
            // Act
            Func<Task> action = async () => await _service.ResizeAsync(null);

            // Assert
            await action.Should().ThrowAsync<ArgumentNullException>();
        }

        [Test]
        public async Task ChangePeriodAsync_ChangePeriodDtoNotNull_ShouldChangePeriod()
        {
            // Arrange
            var changePeriodDto = new ChangePeriodDTO
            {
                Id = 1,
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddDays(1)
            };

            BoardAction? changedBoardAction = null;
            _repositoryMock.Setup(s => s.ChangePeriodAsync(It.IsAny<long>(), It.IsAny<BoardAction>()))
                .ReturnsAsync(true)
                .Callback<long, BoardAction>((id, boardAction) => changedBoardAction = boardAction);

            // Act
            var result = await _service.ChangePeriodAsync(changePeriodDto);

            // Assert
            result.Should().BeTrue();
            changedBoardAction.Should().NotBeNull();
            changedBoardAction.StartDate.Should().Be(changePeriodDto.StartDate);
            changedBoardAction.EndDate.Should().Be(changePeriodDto.EndDate);
        }

        [Test]
        public async Task ChangePeriodAsync_ChangePeriodDtoNull_ShouldThrowException()
        {
            // Act
            Func<Task> action = async () => await _service.ChangePeriodAsync(null);

            // Assert
            await action.Should().ThrowAsync<ArgumentNullException>();
        }

        [Test]
        public async Task ConcludeBoardActionAsync_ConcludeBoardActionDtoNotNull_ShouldConcludeBoardAction()
        {
            // Arrange
            var concludeBoardActionDto = new ConcludeBoardActionDTO
            {
                Id = 1
            };

            BoardAction? concludedBoardAction = null;
            _repositoryMock.Setup(s => s.ConcludeBoardActionAsync(It.IsAny<long>(), It.IsAny<BoardAction>()))
                .ReturnsAsync(true)
                .Callback<long, BoardAction>((id, boardAction) => concludedBoardAction = boardAction);

            // Act
            var result = await _service.ConcludeBoardActionAsync(concludeBoardActionDto);

            // Assert
            result.Should().BeTrue();
            concludedBoardAction.Should().NotBeNull();
            concludedBoardAction.ConcludedAt.Should().BeCloseTo(DateTime.Now, TimeSpan.FromSeconds(1));
        }

        [Test]
        public async Task ConcludeBoardActionAsync_ConcludeBoardActionDtoNull_ShouldThrowException()
        {
            // Act
            Func<Task> action = async () => await _service.ConcludeBoardActionAsync(null);

            // Assert
            await action.Should().ThrowAsync<ArgumentNullException>();
        }

        [Test]
        public async Task LinkAsync_LinkBoardActionDtoNotNull_ShouldLinkBoardActions()
        {
            // Arrange
            var linkBoardActionDto = new LinkBoardActionDTO
            {
                BaseBoardActionId = 1,
                LinkedBoardActionId = 2
            };

            BoardActionLink? linkedBoardAction = null;
            _repositoryMock.Setup(s => s.LinkAsync(It.IsAny<BoardActionLink>()))
                .ReturnsAsync(true)
                .Callback<BoardActionLink>(boardActionLink => linkedBoardAction = boardActionLink);

            // Act
            var result = await _service.LinkAsync(linkBoardActionDto);

            // Assert
            result.Should().BeTrue();
            linkedBoardAction.Should().NotBeNull();
            linkedBoardAction.BaseBoardActionId.Should().Be(linkBoardActionDto.BaseBoardActionId);
            linkedBoardAction.LinkedBoardActionId.Should().Be(linkBoardActionDto.LinkedBoardActionId);
        }

        [Test]
        public async Task LinkAsync_LinkBoardActionDtoNull_ShouldThrowException()
        {
            // Act
            Func<Task> action = async () => await _service.LinkAsync(null);

            // Assert
            await action.Should().ThrowAsync<ArgumentNullException>();
        }

        [Test]
        public async Task DelayBoardActionsFromProjectAsync_ProjectIsNull_DoesNotCallSaveChanges()
        {
            _projectServiceMock.Setup(s => s.GetProjectAsync(It.IsAny<long>())).ReturnsAsync((Project)null);

            await _service.DelayBoardActionsFromProjectAsync(1);

            _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Test]
        public async Task DelayBoardActionsFromProjectAsync_ProjectBoardActionsShouldNotBeDelayed_DoesNotCallSaveChanges()
        {
            var project = new Project
            {
                BoardActions = new List<BoardAction>()
            };

            _projectServiceMock.Setup(s => s.GetProjectAsync(It.IsAny<long>())).ReturnsAsync(project);

            await _service.DelayBoardActionsFromProjectAsync(1);

            _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Test]
        public async Task DelayBoardActionsFromProjectAsync_ValidProject_DelaysBoardActionsAndSavesChanges()
        {
            var fixedDate = new DateTime(2024, 1, 1);
            var boardAction = new BoardAction
            {
                StartDate = fixedDate,
                EndDate = fixedDate,
                ConcludedAt = null,
                BoardActionLinks = new List<BoardActionLink>()
            };

            var project = new Project
            {
                BoardActions = new List<BoardAction> { boardAction }
            };

            _projectServiceMock.Setup(s => s.GetProjectAsync(It.IsAny<long>())).ReturnsAsync(project);

            await _service.DelayBoardActionsFromProjectAsync(1);

            boardAction.StartDate.Should().Be(fixedDate.AddDays(1));
            boardAction.EndDate.Should().Be(fixedDate.AddDays(1));
            _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Test]
        public async Task DelayBoardActionsFromProjectAsync_ValidProjectWithLinks_DelaysBoardActionsAndLinkedActions()
        {
            var fixedDate = new DateTime(2024, 1, 1);
            var linkedBoardAction = new BoardAction
            {
                Id = 2,
                StartDate = fixedDate,
                EndDate = fixedDate,
                ConcludedAt = null,
                BoardActionLinks = new List<BoardActionLink>()
            };

            var boardAction = new BoardAction
            {
                Id = 1,
                StartDate = fixedDate,
                EndDate = fixedDate,
                ConcludedAt = null,
                BoardActionLinks = new List<BoardActionLink>
                {
                    new BoardActionLink
                    {
                        BaseBoardActionId = 1,
                        LinkedBoardActionId = 2,
                        LinkedBoardAction = linkedBoardAction
                    }
                }
            };

            linkedBoardAction.BoardActionLinks.Add(new BoardActionLink
            {
                BaseBoardActionId = 1,
                BaseBoardAction = boardAction,
                LinkedBoardActionId = 2,
                LinkedBoardAction = linkedBoardAction
            });

            var project = new Project
            {
                BoardActions = new List<BoardAction> { boardAction, linkedBoardAction }
            };

            _projectServiceMock.Setup(s => s.GetProjectAsync(It.IsAny<long>()))
                .ReturnsAsync(project);

            await _service.DelayBoardActionsFromProjectAsync(1);

            boardAction.StartDate.Should().Be(fixedDate.AddDays(1));
            boardAction.EndDate.Should().Be(fixedDate.AddDays(1));
            linkedBoardAction.StartDate.Should().Be(fixedDate.AddDays(1));
            linkedBoardAction.EndDate.Should().Be(fixedDate.AddDays(1));
            _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

    }
}
