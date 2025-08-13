using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Quark.Models;
using Quark.Services.ModelServices.UserService;

namespace Quark.Controllers.UserController;

[Route("users")]
[ApiController]
[ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
public partial class UserController(IUserService userService, SignInManager<User> signInManager)
    : ControllerBase;
