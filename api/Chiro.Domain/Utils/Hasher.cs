using System.Security.Cryptography;
using System.Text;

namespace Chiro.Domain.Utils
{
    public static class Hasher
    {
        public static string Encrypt(string data, string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException("key");
            }

            if (string.IsNullOrEmpty(data))
            {
                throw new ArgumentNullException("data");
            }

            using (var aes = Aes.Create())
            {
                aes.BlockSize = 128;
                aes.KeySize = 256;
                aes.Mode = CipherMode.CBC;

                aes.GenerateIV();

                var rfc2898 = new Rfc2898DeriveBytes(key, new byte[16]);
                aes.Key = rfc2898.GetBytes(aes.KeySize / 8);
                aes.IV = rfc2898.GetBytes(aes.BlockSize / 8);

                var encryptor = aes.CreateEncryptor();
                byte[] encrypted = encryptor.TransformFinalBlock(Encoding.UTF8.GetBytes(data), 0, Encoding.UTF8.GetBytes(data).Length);

                var combined = new byte[aes.IV.Length + encrypted.Length];
                Array.Copy(aes.IV, 0, combined, 0, aes.IV.Length);
                Array.Copy(encrypted, 0, combined, aes.IV.Length, encrypted.Length);

                return Convert.ToBase64String(combined);
            }
        }
    }
}
