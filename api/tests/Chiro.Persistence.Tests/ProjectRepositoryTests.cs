using Chiro.Domain.Entities;
using Chiro.Infra;
using Chiro.Persistence.Repositories;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace Chiro.Persistence.Tests
{
    public class ProjectRepositoryTests : IRepositoryTestBase
    {
        private ProjectContext _context;
        private ProjectRepository _repository;

        [SetUp]
        public void Setup()
        {
            _context = CreateInMemoryDatabase();
            _repository = new ProjectRepository(_context);
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Test]
        public async Task GetProjectAsync_ProjectWithNoBoardActions_ShouldReturnProjectWithoutBoardActions()
        {
            // Arrange
            var projectId = 1;

            // Act
            var result = await _repository.GetProjectAsync(projectId);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(projectId);
            result.BoardActions.Should().BeEmpty();
        }

        [Test]
        public async Task GetProjectAsync_ProjectWithExistingBoardActions_ShouldReturnProjectWithBoardActions()
        {
            // Arrange
            var projectId = 2;

            // Act
            var result = await _repository.GetProjectAsync(projectId);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(projectId);
            result.BoardActions.Should().NotBeEmpty();
            result.BoardActions.All(x => x.ProjectId == projectId).Should().BeTrue();
        }

        [Test]
        public async Task GetProjectAsync_ProjectWithBoardActionsAndLinks_ShouldReturnProjectWithBoardActionsAndLinks()
        {
            // Arrange
            var projectId = 3;
            

            // Act
            var result = await _repository.GetProjectAsync(projectId);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(projectId);
            result.BoardActions.Should().NotBeEmpty();
            result.BoardActions.All(x => x.ProjectId == projectId).Should().BeTrue();
            result.BoardActions.First().BoardActionLinks.Should().NotBeEmpty();
        }

        [Test]
        public async Task GetProjectAsync_ProjectDoesNotExist_ShouldReturnNull()
        {
            // Arrange
            var projectId = 1000;

            // Act
            var result = await _repository.GetProjectAsync(projectId);

            // Assert
            result.Should().BeNull();
        }

        [Test]
        public async Task GetProjectsAsync_NotExistingProjects_ShouldReturnEmptyList()
        {
            // Arrange
            var dbOptions = new DbContextOptionsBuilder<ProjectContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString());

            var isolatedContext = new ProjectContext(dbOptions.Options);

            // Act
            var result = await new ProjectRepository(isolatedContext).GetProjectsAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEmpty();

            isolatedContext.Database.EnsureDeleted();
            isolatedContext.Dispose();
        }

        [Test]
        public async Task GetProjectsAsync_ExistingProjects_ShouldReturnProjects()
        {
            // Arrange
            var projectsQuantity = _context.Projects.Count();

            // Act
            var result = await _repository.GetProjectsAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().NotBeEmpty();
            result.Count().Should().Be(projectsQuantity);
        }

        [Test]
        public async Task GetProjectsWithActionsAsync_NotExistingProjects_ShouldReturnEmptyList()
        {
            // Arrange
            var dbOptions = new DbContextOptionsBuilder<ProjectContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString());

            var isolatedContext = new ProjectContext(dbOptions.Options);

            // Act
            var result = await new ProjectRepository(isolatedContext).GetProjectsWithActionsAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEmpty();

            isolatedContext.Database.EnsureDeleted();
            isolatedContext.Dispose();
        }

        [Test]
        public async Task GetProjectsWithActionsAsync_ExistingProjects_ShouldReturnProjects()
        {
            // Arrange
            var projectsQuantity = _context.Projects.Count();

            // Act
            var result = await _repository.GetProjectsWithActionsAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().NotBeEmpty();
            result.Count().Should().Be(projectsQuantity);
        }

        [Test]
        public async Task ChangeColorAsync_ProjectExists_ShouldChangeColor()
        {
            // Arrange
            var projectId = 1;
            var newColor = "#DDD";

            // Act
            var result = await _repository.ChangeColorAsync(new Project
            {
                Id = projectId,
                Color = newColor
            });

            // Assert
            result.Should().BeTrue();

            var project = await _context.Projects.FirstAsync(p => p.Id == projectId);
            await _context.Entry(project).ReloadAsync();
            project.Should().NotBeNull();
            project.Color.Should().Be(newColor);
        }

        [Test]
        public async Task ChangeColorAsync_ProjectDoesNotExist_ShouldNotChangeColor()
        {
            // Arrange
            var nonExistingProjectId = 1000;
            var newColor = "#000";

            // Act
            var result = await _repository.ChangeColorAsync(new Project
            {
                Id = nonExistingProjectId,
                Color = newColor
            });

            // Assert
            result.Should().BeFalse();

            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == nonExistingProjectId);
            project.Should().BeNull();
        }

        [Test]
        public async Task MoveAsync_ProjectExists_ShouldMoveProject()
        {
            // Arrange
            var projectId = 1;
            var newPositionX = 100;
            var newPositionY = 200;

            // Act
            var result = await _repository.MoveAsync(new Project
            {
                Id = projectId,
                PositionX = newPositionX,
                PositionY = newPositionY
            });

            // Assert
            result.Should().BeTrue();

            var project = await _context.Projects.FirstAsync(p => p.Id == projectId);
            await _context.Entry(project).ReloadAsync();
            project.Should().NotBeNull();
            project.PositionX.Should().Be(newPositionX);
            project.PositionY.Should().Be(newPositionY);
        }

        [Test]
        public async Task MoveAsync_ProjectDoesNotExist_ShouldNotMoveProject()
        {
            // Arrange
            var nonExistingProjectId = 1000;
            var newPositionX = 50;
            var newPositionY = 60;

            // Act
            var result = await _repository.MoveAsync(new Project
            {
                Id = nonExistingProjectId,
                PositionX = newPositionX,
                PositionY = newPositionY
            });

            // Assert
            result.Should().BeFalse();

            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == nonExistingProjectId);
            project.Should().BeNull();
        }

        [Test]
        public async Task ResizeAsync_ProjectExists_ShouldResizeProject()
        {
            // Arrange
            var projectId = 1;
            var newWidth = 500;
            var newHeight = 300;

            // Act
            var result = await _repository.ResizeAsync(projectId, new Project
            {
                Width = newWidth,
                Height = newHeight
            });

            // Assert
            result.Should().BeTrue();

            var project = await _context.Projects.FirstAsync(p => p.Id == projectId);
            await _context.Entry(project).ReloadAsync();
            project.Should().NotBeNull();
            project.Width.Should().Be(newWidth);
            project.Height.Should().Be(newHeight);
        }

        [Test]
        public async Task ResizeAsync_ProjectDoesNotExist_ShouldNotResizeProject()
        {
            // Arrange
            var nonExistingProjectId = 1000;
            var newWidth = 800;
            var newHeight = 600;

            // Act
            var result = await _repository.ResizeAsync(nonExistingProjectId, new Project
            {
                Width = newWidth,
                Height = newHeight
            });

            // Assert
            result.Should().BeFalse();

            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == nonExistingProjectId);
            project.Should().BeNull();
        }

        [Test]
        public async Task CreateProjectAsync_ValidProject_ShouldCreateProject()
        {
            // Arrange
            var project = new Domain.Entities.Project
            {
                Name = "New Project",
                Color = "#FFF",
                Password = "Password",
                PositionX = 10,
                PositionY = 20,
                Width = 100,
                Height = 200
            };

            // Act
            var result = await _repository.CreateProjectAsync(project);

            // Assert
            result.Should().BeGreaterThan(0);

            var createdProject = await _context.Projects.FirstOrDefaultAsync(p => p.Name == project.Name);
            createdProject.Should().NotBeNull();
            createdProject.Name.Should().Be(project.Name);
            createdProject.Color.Should().Be(project.Color);
            createdProject.PositionX.Should().Be(project.PositionX);
            createdProject.PositionY.Should().Be(project.PositionY);
            createdProject.Width.Should().Be(project.Width);
            createdProject.Height.Should().Be(project.Height);
        }

        [Test]
        public async Task CreateProjectAsync_NullProject_ShouldNotCreateProject()
        {
            // Arrange
            Domain.Entities.Project project = null;

            // Act
            Func<Task> act = async () => { await _repository.CreateProjectAsync(project); };

            // Assert
            await act.Should().ThrowAsync<ArgumentNullException>();
        }

        [Test]
        public async Task CreateProjectAsync_InvalidProject_ShouldNotCreateProject()
        {
            // Arrange
            var project = new Domain.Entities.Project
            {
                Id = 0,
                Color = "#FFF",
                PositionX = 10,
                PositionY = 20,
                Width = 100,
                Height = 200
            };

            // Act
            Func<Task> act = async () => { await _repository.CreateProjectAsync(project); };

            // Assert
            await act.Should().ThrowAsync<DbUpdateException>();

            var createdProject = await _context.Projects.FirstOrDefaultAsync(p => p.Name == null);
            createdProject.Should().BeNull();
        }


        public ProjectContext CreateInMemoryDatabase()
        {
            var dbOptions = new DbContextOptionsBuilder<ProjectContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString());

            _context = new ProjectContext(dbOptions.Options);
            _context.Projects.AddRange(
                new Project
                {
                    Color = "#FFF",
                    Name = "Project",
                    Password = "Password",
                },
                new Project
                {
                    Color = "#FFF",
                    Name = "Project",
                    Password = "Password",
                    BoardActions = new List<BoardAction>
                    {
                        new BoardAction
                        {
                            StartDate = DateTime.Now.AddDays(-1),
                            EndDate = DateTime.Now.AddDays(1),
                            Color = "#FFF",
                            Content = "Action",
                        },
                        new BoardAction
                        {
                            StartDate = DateTime.Now.AddDays(2),
                            EndDate = DateTime.Now.AddDays(3),
                            Color = "#FFF",
                            Content = "Action 2",
                        }
                    }
                },
                new Project
                {
                    Color = "#FFF",
                    Name = "Project",
                    Password = "Password",
                    BoardActions = new List<BoardAction>
                    {
                        new BoardAction
                        {
                            StartDate = DateTime.Now.AddDays(-1),
                            EndDate = DateTime.Now.AddDays(1),
                            Color = "#FFF",
                            Content = "Action",
                            BoardActionLinks = new List<BoardActionLink>
                            {
                                new BoardActionLink
                                {
                                    BaseBoardActionId = 3,
                                    LinkedBoardActionId = 4
                                }
                            }
                        },
                        new BoardAction
                        {
                            StartDate = DateTime.Now.AddDays(4),
                            EndDate = DateTime.Now.AddDays(5),
                            Color = "#FFF",
                            Content = "Action 2",
                        }
                    }
                }
            );
            _context.SaveChanges();

            return _context;
        }
    }
}
