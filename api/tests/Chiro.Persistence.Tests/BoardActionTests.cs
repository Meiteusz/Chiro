using Chiro.Domain.Entities;
using Chiro.Infra;
using Chiro.Persistence.Repositories;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace Chiro.Persistence.Tests
{
    public class BoardActionTests : IRepositoryTestBase
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

            var dbOptions = new DbContextOptionsBuilder<ProjectContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString());

            using (var context = new ProjectContext(dbOptions.Options))
            {
                var repository = new BoardActionRepository(context);
                var result = await repository.CreateBoardActionAsync(new BoardAction
                {
                    StartDate = startDate,
                    EndDate = endDate,
                });

                result.Should().BeTrue();
                var BoardAction = await context.BoardActions.FirstAsync();

                BoardAction.Should().NotBeNull();
                BoardAction.Id.Should().Be(1);
                BoardAction.StartDate.Should().Be(startDate);
                BoardAction.EndDate.Should().Be(endDate);
            }
        }

        public ProjectContext CreateInMemoryDatabase()
        {
            var dbOptions = new DbContextOptionsBuilder<ProjectContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString());

            _context = new ProjectContext(dbOptions.Options);
            _context.BoardActions.Add(new BoardAction
            {
                StartDate = DateTime.Now.AddDays(-1),
                EndDate = DateTime.Now.AddDays(1)
            });
            _context.SaveChanges();

            return _context;
        }
    }
}