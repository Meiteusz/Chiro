using System.Security.Cryptography;
using System.Text;

namespace Chiro.Domain.Utils
{
    public static class Hasher
    {
        public static string Encrypt(string data)
        {
            var bytes = Encoding.ASCII.GetBytes(data);
            bytes = SHA256.Create().ComputeHash(bytes);
            return Encoding.ASCII.GetString(bytes);
        }
    }
}
