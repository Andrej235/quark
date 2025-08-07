namespace Quark.Utilities;

public static class AuthPolicies
{
    public const string CookieOnly = "CookiePolicy";
    public const string JwtOnly = "JwtPolicy";
    public const string CookieOrJwt = "CookieOrJwtPolicy";
}
