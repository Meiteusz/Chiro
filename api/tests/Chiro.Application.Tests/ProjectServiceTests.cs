using Chiro.Application.Interfaces;
using Chiro.Application.Services;
using Chiro.Domain.DTOs;
using Chiro.Domain.Entities;
using Chiro.Domain.Interfaces;
using FluentAssertions;
using Moq;

namespace Chiro.Application.Tests
{
    public class ProjectServiceTests
    {
        private ProjectService _service;
        private Mock<IProjectRepository> _projectRepositoryMock;

        [SetUp]
        public void Setup()
        {
            _projectRepositoryMock = new Mock<IProjectRepository>();

            _service = new ProjectService(_projectRepositoryMock.Object);
        }

        [Test]
        public async Task CreateProject_CreateProjectDtoNotNull_ShouldCreateProject()
        {
            // Arrange
            var createProjectDto = new CreateProjectDTO
            {
                Color = "#FFF",
                Name = "Name",
                Password = "Password",
                PositionX = 0,
                PositionY = 0,
                Height = 200,
                Width = 200,
            };

            Project? createdProject = null;
            _projectRepositoryMock.Setup(s => s.CreateProjectAsync(It.IsAny<Project>()))
                .ReturnsAsync(1)
                .Callback<Project>(project => createdProject = project);

            // Act
            var result = await _service.CreateProject(createProjectDto);

            // Assert
            result.Should().BePositive();
            createdProject.Should().NotBeNull();
            createdProject.Color.Should().Be(createProjectDto.Color);
            createdProject.Name.Should().Be(createProjectDto.Name);
            createdProject.PositionX.Should().Be(createProjectDto.PositionX);
            createdProject.PositionY.Should().Be(createProjectDto.PositionY);
            createdProject.Height.Should().Be(createProjectDto.Height);
            createdProject.Width.Should().Be(createProjectDto.Width);
        }

        [Test]
        public async Task CreateProject_CreateProjectDtoNull_ShouldThrowException()
        {
            // Act
            Func<Task> action = async () => await _service.CreateProject(null);

            // Assert
            await action.Should().ThrowAsync<ArgumentNullException>();
        }

        [Test]
        public async Task ResizeAsync_ResizeProjectDtoNotNull_ShouldResizeProject()
        {
            // Arrange
            var resizeProjectDto = new ResizeProjectDTO
            {
                Id = 1,
                Width = 500,
                Height = 300
            };

            Project? resizedProject = null;
            _projectRepositoryMock.Setup(s => s.ResizeAsync(It.IsAny<long>(), It.IsAny<Project>()))
                .ReturnsAsync(true)
                .Callback<long, Project>((id, project) => resizedProject = project);

            // Act
            var result = await _service.ResizeAsync(resizeProjectDto);

            // Assert
            result.Should().BeTrue();
            resizedProject.Should().NotBeNull();
            resizedProject.Width.Should().Be(resizeProjectDto.Width);
            resizedProject.Height.Should().Be(resizeProjectDto.Height);
        }

        [Test]
        public async Task ResizeAsync_ResizeProjectDtoNull_ShouldThrowException()
        {
            // Act
            Func<Task> action = async () => await _service.ResizeAsync(null);

            // Assert
            await action.Should().ThrowAsync<ArgumentNullException>();
        }

        [Test]
        public async Task MoveAsync_MoveProjectDtoNotNull_ShouldMoveProject()
        {
            // Arrange
            var moveProjectDto = new MoveProjectDTO
            {
                Id = 1,
                PositionX = 100,
                PositionY = 200
            };

            Project? movedProject = null;
            _projectRepositoryMock.Setup(s => s.MoveAsync(It.IsAny<Project>()))
                .ReturnsAsync(true)
                .Callback<Project>(project => movedProject = project);

            // Act
            var result = await _service.MoveAsync(moveProjectDto);

            // Assert
            result.Should().BeTrue();
            movedProject.Should().NotBeNull();
            movedProject.Id.Should().Be(moveProjectDto.Id);
            movedProject.PositionX.Should().Be(moveProjectDto.PositionX);
            movedProject.PositionY.Should().Be(moveProjectDto.PositionY);
        }

        [Test]
        public async Task MoveAsync_MoveProjectDtoNull_ShouldThrowException()
        {
            // Arrange
            MoveProjectDTO moveProjectDto = null;

            // Act
            Func<Task> action = async () => await _service.MoveAsync(moveProjectDto);

            // Assert
            await action.Should().ThrowAsync<ArgumentNullException>();
        }

        [Test]
        public async Task ChangeColorAsync_ChangeProjectColorDtoNotNull_ShouldChangeColor()
        {
            // Arrange
            var changeProjectColorDto = new ChangeProjectColorDTO
            {
                Id = 1,
                Color = "#FFF"
            };

            Project? changedProject = null;
            _projectRepositoryMock.Setup(s => s.ChangeColorAsync(It.IsAny<Project>()))
                .ReturnsAsync(true)
                .Callback<Project>(project => changedProject = project);

            // Act
            var result = await _service.ChangeColorAsync(changeProjectColorDto);

            // Assert
            result.Should().BeTrue();
            changedProject.Should().NotBeNull();
            changedProject.Id.Should().Be(changeProjectColorDto.Id);
            changedProject.Color.Should().Be(changeProjectColorDto.Color);
        }

        [Test]
        public async Task ChangeColorAsync_ChangeProjectColorDtoNull_ShouldThrowException()
        {
            // Act
            Func<Task> action = async () => await _service.ChangeColorAsync(null);

            // Assert
            await action.Should().ThrowAsync<ArgumentNullException>();
        }

        [Test]
        public async Task GetProjectAsync_ValidProjectId_ShouldReturnProject()
        {
            // Arrange
            var projectId = 1;
            var expectedProject = new Project
            {
                Id = projectId,
                Name = "Test Project",
                Color = "#FFF",
                PositionX = 10,
                PositionY = 20,
                Width = 100,
                Height = 200
            };

            _projectRepositoryMock.Setup(s => s.GetProjectAsync(projectId))
                .ReturnsAsync(expectedProject);

            // Act
            var result = await _service.GetProjectAsync(projectId);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(expectedProject.Id);
            result.Name.Should().Be(expectedProject.Name);
            result.Color.Should().Be(expectedProject.Color);
            result.PositionX.Should().Be(expectedProject.PositionX);
            result.PositionY.Should().Be(expectedProject.PositionY);
            result.Width.Should().Be(expectedProject.Width);
            result.Height.Should().Be(expectedProject.Height);
        }

        [Test]
        public async Task GetProjectAsync_InvalidProjectId_ShouldThrowArgumentOutOfRangeException()
        {
            // Arrange
            var invalidProjectId = -1;

            // Act
            Func<Task> action = async () => await _service.GetProjectAsync(invalidProjectId);

            // Assert
            await action.Should().ThrowAsync<ArgumentOutOfRangeException>();
        }

        [Test]
        public async Task GetProjectAsync_ProjectDoesNotExist_ShouldReturnNull()
        {
            // Arrange
            var nonExistingProjectId = 1000;
            _projectRepositoryMock.Setup(s => s.GetProjectAsync(nonExistingProjectId))
                .ReturnsAsync((Project?)null);

            // Act
            var result = await _service.GetProjectAsync(nonExistingProjectId);

            // Assert
            result.Should().BeNull();
        }

        [Test]
        public async Task GetProjectsAsync_ShouldReturnListOfProjects()
        {
            // Arrange
            var expectedProjects = new List<Project>
            {
                new Project
                {
                    Id = 1,
                    Name = "Project 1",
                    Color = "#FFF",
                    PositionX = 10,
                    PositionY = 20,
                    Width = 100,
                    Height = 200
                },
                new Project
                {
                    Id = 2,
                    Name = "Project 2",
                    Color = "#000",
                    PositionX = 30,
                    PositionY = 40,
                    Width = 300,
                    Height = 400
                }
            };

            _projectRepositoryMock.Setup(s => s.GetProjectsAsync())
                .ReturnsAsync(expectedProjects);

            // Act
            var result = await _service.GetProjectsAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(expectedProjects.Count);
            result.Should().BeEquivalentTo(expectedProjects);
        }

        [Test]
        public async Task GetProjectsAsync_ShouldReturnEmptyListWhenNoProjectsExist()
        {
            // Arrange
            var expectedProjects = new List<Project>();

            _projectRepositoryMock.Setup(s => s.GetProjectsAsync())
                .ReturnsAsync(expectedProjects);

            // Act
            var result = await _service.GetProjectsAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEmpty();
        }

        [Test]
        public async Task GetProjectsWithActionsAsync_ShouldReturnListOfProjectsWithActions()
        {
            // Arrange
            var expectedProjects = new List<Project>
            {
                new Project
                {
                    Id = 1,
                    Name = "Project 1",
                    Color = "#FFF",
                    PositionX = 10,
                    PositionY = 20,
                    Width = 100,
                    Height = 200
                },
                new Project
                {
                    Id = 2,
                    Name = "Project 2",
                    Color = "#000",
                    PositionX = 30,
                    PositionY = 40,
                    Width = 300,
                    Height = 400
                }
            };

            _projectRepositoryMock.Setup(s => s.GetProjectsWithActionsAsync())
                .ReturnsAsync(expectedProjects);

            // Act
            var result = await _service.GetProjectsWithActionsAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(expectedProjects.Count);
            result.Should().BeEquivalentTo(expectedProjects);
        }

        [Test]
        public async Task GetProjectsWithActionsAsync_ShouldReturnEmptyListWhenNoProjectsExist()
        {
            // Arrange
            var expectedProjects = new List<Project>();

            _projectRepositoryMock.Setup(s => s.GetProjectsWithActionsAsync())
                .ReturnsAsync(expectedProjects);

            // Act
            var result = await _service.GetProjectsWithActionsAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEmpty();
        }
    }
}