using LinkShortner.Domain.Entities;

namespace LinkShortner.Domain.Utilities;

public interface ITokenService
{
    public string GenerateToken(User user);
}