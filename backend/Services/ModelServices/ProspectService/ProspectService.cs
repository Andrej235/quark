using Microsoft.AspNetCore.Identity;
using Quark.Dtos.Request.Prospect;
using Quark.Models;
using Quark.Services.Create;
using Quark.Services.Mapping.Request;
using Quark.Services.Read;
using Quark.Services.Read.KeysetPagination;
using Quark.Services.TeamPermissions;
using Quark.Services.Update;

namespace Quark.Services.ModelServices.ProspectService;

public partial class ProspectService(
    ICreateSingleService<Prospect> createService,
    IKeysetPaginationService<Prospect> paginationService,
    IReadSingleSelectedService<Prospect> readService,
    IUpdateRangeService<ProspectDataField> fieldUpdateService,
    IExecuteUpdateService<Prospect> updateService,
    IRequestMapper<CreateProspectRequestDto, Prospect> createRequestMapper,
    UserManager<User> userManager,
    ITeamPermissionsService teamPermissionsService
) : IProspectService;
