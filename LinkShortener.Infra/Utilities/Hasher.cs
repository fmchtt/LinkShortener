using LinkShortner.Domain.Utilities;

namespace LinkShortner.Infra.Utilities;

public class Hasher : IHasher
{
    public string GenerateHash()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray())[..8];
    }

    public string Hash(string key)
    {
        return BCrypt.Net.BCrypt.HashPassword(key);
    }

    public bool Validate(string key, string hashedKey)
    {
        return BCrypt.Net.BCrypt.Verify(key, hashedKey);
    }
}