using Microsoft.AspNetCore.Identity;
using Quark.Dtos.Request.ProspectListViewItem;
using Quark.Models;
using Quark.Services.Create;
using Quark.Services.Delete;
using Quark.Services.Mapping.Request;
using Quark.Services.Read;
using Quark.Services.TeamPermissions;

namespace Quark.Services.ModelServices.ProspectViewService;

public partial class ProspectViewService(
    ICreateRangeService<ProspectListViewItem> createService,
    IReadRangeSelectedService<ProspectListViewItem> readService,
    IDeleteService<ProspectListViewItem> deleteService,
    IRequestMapper<CreateProspectViewItemRequestDto, ProspectListViewItem> createRequestMapper,
    UserManager<User> userManager,
    ITeamPermissionsService permissionsService
) : IProspectViewService;
