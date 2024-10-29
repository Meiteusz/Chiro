using Chiro.Application.Interfaces;
using Chiro.Domain.Utils;
using Chiro.Domain.Utils.interfaces;

namespace Chiro.Application.Services
{
    public class BoardWithoutAuthenticationService : IBoardWithoutAuthenticationService
    {
        private ICacheManager _cache;

        public BoardWithoutAuthenticationService(ICacheManager cache)
        {
            _cache = cache;
        }

        public string? DecryptToken(string token)
        {
            /*var tokenInCache = _cache.Get(token);

            if (tokenInCache == null)
            {
                throw new Exception("Este link expirou...");
            }*/

            return new AES().DecryptAesToken(token).Split("|")[0];
        }

        public string? GenerateToken(long projectId, int randomNumber)
        {
            var token = new AES().GenerateAesTokenWithProjectId(projectId, randomNumber);
            //_cache.Add(token, token, 30);

            return token;
        }

        public string? GenerateUrl(string token)
        {       
            return $"/project-board-link?param={token}";
        }
    }
}
