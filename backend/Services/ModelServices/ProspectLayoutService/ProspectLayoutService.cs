using Microsoft.AspNetCore.Identity;
using Quark.Models;
using Quark.Services.Read;

namespace Quark.Services.ModelServices.ProspectLayoutService;

public partial class ProspectLayoutService(
    IReadSingleSelectedService<Team> teamReadSelectedService,
    UserManager<User> userManager
) : IProspectLayoutService;
