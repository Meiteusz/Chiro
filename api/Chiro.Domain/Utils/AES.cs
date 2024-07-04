using System;
using System.IO;
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
                    }

                    // Convertendo para Base64 e fazendo URL-safe
                    string base64 = Convert.ToBase64String(ms.ToArray());
                    string urlSafeBase64 = base64.Replace('+', '-').Replace('/', '_').Replace("=", "");

                    return urlSafeBase64;
                }
            }
        }

        private string Decrypt(string cipherText)
        {
            // Recolocando os caracteres URL-safe pelos seus equivalentes Base64
            string base64 = cipherText.Replace('-', '+').Replace('_', '/');

            switch (base64.Length % 4)
            {
                case 2: base64 += "=="; break;
                case 3: base64 += "="; break;
            }

            byte[] buffer = Convert.FromBase64String(base64);

            using (Aes aes = Aes.Create())
            {
                aes.Key = _key;
                aes.IV = _iv;

                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                using (MemoryStream ms = new MemoryStream(buffer))
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
