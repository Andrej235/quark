using Microsoft.AspNetCore.Identity;
using Quark.Dtos.Request.TeamRoles;
using Quark.Dtos.Response.TeamRoles;
using Quark.Models;
using Quark.Services.Create;
using Quark.Services.Delete;
using Quark.Services.Mapping.Request;
using Quark.Services.Mapping.Response;
using Quark.Services.Read;
using Quark.Services.TeamPermissions;
using Quark.Services.Update;

namespace Quark.Services.ModelServices.TeamRoleService;

public partial class TeamRoleService(
    ICreateSingleService<TeamRole> createService,
    IReadRangeService<TeamRole> readService,
    IUpdateSingleService<TeamRole> updateService,
    IDeleteService<TeamRole> deleteService,
    IRequestMapper<CreateTeamRoleRequestDto, TeamRole> createRequestMapper,
    IRequestMapper<UpdateTeamRoleRequestDto, TeamRole> updateRequestMapper,
    IResponseMapper<TeamRole, TeamRoleResponseDto> responseMapper,
    UserManager<User> userManager,
    ITeamPermissionsService permissionsService
) : ITeamRoleService;
