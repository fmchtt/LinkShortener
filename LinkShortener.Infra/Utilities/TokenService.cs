using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LinkShortner.Domain.Entities;
using LinkShortner.Domain.Utilities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace LinkShortner.Infra.Utilities;

public class TokenService(IConfiguration configuration) : ITokenService
{
    private byte[] SecretKey { get; } =
        Encoding.ASCII.GetBytes(configuration["SecretKey"] ??
                                throw new ArgumentException("Secret key não encontrada!"));

    public string GenerateToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, user.Id.ToString()),
            }),
            Expires = DateTime.UtcNow.AddHours(4),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(SecretKey),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}