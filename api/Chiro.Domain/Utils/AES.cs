using System.Security.Cryptography;
using System.Text;

namespace Chiro.Domain.Utils
{
    public class AES
    {
        private readonly byte[] _key;
        private readonly byte[] _iv;

        public AES()
        {
            // Chave e IV devem ser mantidos seguros e consistentes. Este é apenas um exemplo.
            _key = Encoding.UTF8.GetBytes("0123456789abcdef0123456789abcdef"); // 32 bytes for AES-256
            _iv = Encoding.UTF8.GetBytes("0123456789abcdef"); // 16 bytes for AES
        }
        public string GenerateAesTokenWithProjectId(long projectId, int randomNumbers)
        {
            var token = $"{projectId}|{randomNumbers}";
            return Encrypt(token);
        }
        public string DecryptAesToken(string token)
        {
            return Decrypt(token);
        }
        private string Encrypt(string plainText)
        {
            using (Aes aes = Aes.Create())
            {
                aes.Key = _key;
                aes.IV = _iv;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter sw = new StreamWriter(cs))
                        {
                            sw.Write(plainText);
                        }
                        return Convert.ToBase64String(ms.ToArray());
                    }
                }
            }
        }
        private string Decrypt(string cipherText)
        {
            using (Aes aes = Aes.Create())
            {
                aes.Key = _key;
                aes.IV = _iv;

                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                using (MemoryStream ms = new MemoryStream(Convert.FromBase64String(cipherText)))
                {
                    using (CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader sr = new StreamReader(cs))
                        {
                            return sr.ReadToEnd();
                        }
                    }
                }
            }
        }
    }
}
