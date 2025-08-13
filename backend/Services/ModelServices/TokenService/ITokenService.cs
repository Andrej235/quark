using System.Security.Claims;
using Quark.Models;

namespace Quark.Services.ModelServices.TokenService;

public interface ITokenService
{
    string GenerateJwtToken(User user);

    Task<string> GenerateRefreshToken(User user, RefreshToken? existingToken = null);

    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}
