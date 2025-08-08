using Microsoft.AspNetCore.Identity;
using Quark.Dtos.Response.User;
using Quark.Models;
using Quark.Services.Delete;
using Quark.Services.Mapping.Response;
using Quark.Services.ModelServices.TokenService;
using Quark.Services.Read;
using Quark.Services.Update;

namespace Quark.Services.ModelServices.UserService;

public partial class UserService(
    UserManager<User> userManager,
    IEmailSender<User> emailSender,
    ITokenService tokenService,
    IReadSingleService<RefreshToken> tokenReadService,
    IReadSingleService<User> userReadService,
    IExecuteUpdateService<User> userUpdateService,
    IDeleteService<RefreshToken> tokenDeleteService,
    IResponseMapper<User, UserResponseDto> responseMapper,
    IConfiguration configuration
) : IUserService;
