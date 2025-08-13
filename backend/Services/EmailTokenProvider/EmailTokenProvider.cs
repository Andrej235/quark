namespace Quark.Services.EmailTokenProvider;

using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

public class ShortEmailTokenProvider<TUser> : IUserTwoFactorTokenProvider<TUser>
    where TUser : class
{
    private const string AllowedChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No confusing chars like I, 1, O, 0

    public Task<bool> CanGenerateTwoFactorTokenAsync(UserManager<TUser> manager, TUser user) =>
        Task.FromResult(true);

    public Task<string> GenerateAsync(string purpose, UserManager<TUser> manager, TUser user)
    {
        var random = new Random();
        var code = new string(
            [.. Enumerable.Repeat(AllowedChars, 6).Select(s => s[random.Next(s.Length)])]
        );

        manager.SetAuthenticationTokenAsync(user, "ShortEmail", purpose, code);
        return Task.FromResult(code);
    }

    public async Task<bool> ValidateAsync(
        string purpose,
        string token,
        UserManager<TUser> manager,
        TUser user
    )
    {
        var storedCode = await manager.GetAuthenticationTokenAsync(user, "ShortEmail", purpose);
        return storedCode == token;
    }
}
