using Microsoft.AspNetCore.Identity;
using Quark.Models;
using Quark.Services.Delete;
using Quark.Services.ModelServices.TokenService;
using Quark.Services.Read;

namespace Quark.Services.ModelServices.UserService;

public partial class UserService(
    UserManager<User> userManager,
    IEmailSender<User> emailSender,
    ITokenService tokenService,
    IReadSingleService<RefreshToken> tokenReadService,
    IDeleteService<RefreshToken> tokenDeleteService,
    IConfiguration configuration
) : IUserService;
