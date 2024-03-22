using Chiro.Domain.Entities;
using Chiro.Infra;
using Chiro.Persistence.Repositories;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace Chiro.Persistence.Tests
{
    public class TimelineActionTests : IRepositoryTestBase
    {
        private ProjectContext _context;
        private TimelineActionRepository _repository;

        [SetUp]
        public void Setup()
        {
            _context = CreateInMemoryDatabase();
            _repository = new TimelineActionRepository(_context);
        }

        [TearDown]
        public void Teardown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task ChangePeriodAsync_ExistingTimelineAction_ShouldChangeTimelineActionPeriod()
        {
            // Arrange
            var newStartDate = DateTime.Now.AddDays(5);
            var newEndDate = DateTime.Now.AddDays(6);

            // Act
            var result = await _repository.ChangePeriodAsync(1, new TimelineAction
            {
                StartDate = newStartDate,
                EndDate = newEndDate,
            });

            // Assert
            result.Should().BeTrue();

            var timelineAction = await _context.TimelineActions.FirstAsync(w => w.Id == 1);
            await _context.Entry(timelineAction).ReloadAsync();

            timelineAction.Should().NotBeNull();
            timelineAction.StartDate.Should().Be(newStartDate);
            timelineAction.EndDate.Should().Be(newEndDate);
        }

        [Test]
        public async Task ChangePeriodAsync_NotExistingTimelineAction_ShouldNotChangeTimelineActionPeriod()
        {
            // Act
            var result = await _repository.ChangePeriodAsync(2, new TimelineAction
            {
                StartDate = DateTime.Now.AddDays(5),
                EndDate = DateTime.Now.AddDays(6),
            });

            // Assert
            result.Should().BeFalse();

            var timelineAction = await _context.TimelineActions.FirstOrDefaultAsync(w => w.Id == 2);
            timelineAction.Should().BeNull();
        }

        [Test]
        public async Task ConcludeTimelineActionAsync_ExistingTimelineAction_ShouldConcludeTimelineAction()
        {
            // Arrange
            var concludedAt = DateTime.Now.AddDays(1);

            // Act
            var result = await _repository.ConcludeTimelineActionAsync(1, new TimelineAction
            {
                ConcludedAt = concludedAt
            });

            // Assert
            result.Should().BeTrue();

            var timelineAction = await _context.TimelineActions.FirstAsync(w => w.Id == 1);
            await _context.Entry(timelineAction).ReloadAsync();
            timelineAction.Should().NotBeNull();

            timelineAction.ConcludedAt.Should().Be(concludedAt);
        }

        [Test]
        public async Task ConcludeTimelineActionAsync_NotExistingTimelineAction_ShouldNotConcludeTimelineAction()
        {
            // Act
            var result = await _repository.ConcludeTimelineActionAsync(2, new TimelineAction
            {
                ConcludedAt = DateTime.Now.AddDays(1),
            });

            // Assert
            result.Should().BeFalse();

            var timelineAction = await _context.TimelineActions.FirstOrDefaultAsync(w => w.Id == 2);
            timelineAction.Should().BeNull();
        }

        [Test]
        public async Task CreateTimelineActionAsync_ValidTimelineAction_ShouldCreateTimelineAction()
        {
            // Arrange
            var startDate = DateTime.Now;
            var endDate = DateTime.Now.AddDays(1);

            var dbOptions = new DbContextOptionsBuilder<ProjectContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString());

            using (var context = new ProjectContext(dbOptions.Options))
            {
                var repository = new TimelineActionRepository(context);
                var result = await repository.CreateTimelineActionAsync(new TimelineAction
                {
                    StartDate = startDate,
                    EndDate = endDate,
                });

                result.Should().BeTrue();
                var timelineAction = await context.TimelineActions.FirstAsync();

                timelineAction.Should().NotBeNull();
                timelineAction.Id.Should().Be(1);
                timelineAction.StartDate.Should().Be(startDate);
                timelineAction.EndDate.Should().Be(endDate);
            }
        }

        public ProjectContext CreateInMemoryDatabase()
        {
            var dbOptions = new DbContextOptionsBuilder<ProjectContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString());

            _context = new ProjectContext(dbOptions.Options);
            _context.TimelineActions.Add(new TimelineAction
            {
                StartDate = DateTime.Now.AddDays(-1),
                EndDate = DateTime.Now.AddDays(1)
            });
            _context.SaveChanges();

            return _context;
        }
    }
}