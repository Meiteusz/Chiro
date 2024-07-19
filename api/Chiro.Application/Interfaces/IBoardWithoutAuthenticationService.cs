namespace Chiro.Application.Interfaces
{
    public interface IBoardWithoutAuthenticationService
    {
        string? GenerateToken(long projectId, int randomNumber);
        string? DecryptToken(string token);
        string? GenerateUrl(string token);
    }
}
