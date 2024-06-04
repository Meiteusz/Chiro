using Chiro.Application.Services;
using Chiro.Domain.DTOs;
using Chiro.Domain.Interfaces;
using FluentAssertions;
using Moq;

namespace Chiro.Application.Tests
{
    public class AuthenticationTokenServiceTests
    {
        private AuthenticationTokenService _service;
        private Mock<IAuthenticationTokenRepository> _repositoryMock;

        [SetUp]
        public void Setup()
        {
            _repositoryMock = new Mock<IAuthenticationTokenRepository>();

            _service = new AuthenticationTokenService(_repositoryMock.Object);
        }

        [Test]
        public async Task AuthenticateAsync_ValidToken_ShouldReturnJwtToken()
        {
            // Arrange
            var authenticateDTO = new AuthenticateDTO { Token = "valid_token" };
            _repositoryMock.Setup(r => r.ExistsByTokenAsync(authenticateDTO.Token))
                .ReturnsAsync(true);

            // Act
            var result = await _service.AuthenticateAsync(authenticateDTO);

            // Assert
            result.Should().NotBeNullOrEmpty();
            result.Should().MatchRegex(@"^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$");
        }

        [Test]
        public async Task AuthenticateAsync_InvalidToken_ShouldReturnEmptyString()
        {
            // Arrange
            var authenticateDTO = new AuthenticateDTO { Token = "invalid_token" };
            _repositoryMock.Setup(r => r.ExistsByTokenAsync(authenticateDTO.Token))
                .ReturnsAsync(false);

            // Act
            var result = await _service.AuthenticateAsync(authenticateDTO);

            // Assert
            result.Should().BeEmpty();
        }

        [Test]
        public void AuthenticateAsync_NullAuthenticateDto_ShouldThrowArgumentNullException()
        {
            // Act
            Func<Task> action = async () => await _service.AuthenticateAsync(null);

            // Assert
            action.Should().ThrowAsync<ArgumentNullException>();
        }
    }
}
