using Microsoft.AspNetCore.Identity;
using Quark.Models;
using Quark.Services.Read;
using Quark.Services.Update;

namespace Quark.Services.ModelServices.ProspectLayoutService;

public partial class ProspectLayoutService(
    IReadSingleSelectedService<Team> teamReadSelectedService,
    IExecuteUpdateService<ProspectLayout> updateService,
    UserManager<User> userManager
) : IProspectLayoutService;
