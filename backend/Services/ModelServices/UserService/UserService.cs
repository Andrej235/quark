using Microsoft.AspNetCore.Identity;
using Quark.Models;

namespace Quark.Services.ModelServices.UserService;

public partial class UserService(
    UserManager<User> userManager,
    IEmailSender<User> emailSender,
    IConfiguration configuration
) : IUserService;
