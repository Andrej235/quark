using Microsoft.AspNetCore.Identity;
using Quark.Dtos.Request.Prospect;
using Quark.Models;
using Quark.Services.Create;
using Quark.Services.Mapping.Request;
using Quark.Services.Read.KeysetPagination;

namespace Quark.Services.ModelServices.ProspectService;

public partial class ProspectService(
    ICreateSingleService<Prospect> createService,
    IKeysetPaginationService<Prospect> paginationService,
    IRequestMapper<CreateProspectRequestDto, Prospect> createRequestMapper,
    UserManager<User> userManager
) : IProspectService;
