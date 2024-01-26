namespace LinkShortner.Domain.Utilities;

public interface IHasher
{
    public string GenerateHash();
    public string Hash(string key);
    public bool Validate(string key, string hashedKey);
}