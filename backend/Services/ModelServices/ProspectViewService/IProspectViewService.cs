using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Response.ProspectListViewItem;

namespace Quark.Services.ModelServices.ProspectViewService;

public partial interface IProspectViewService
{
    Task<Result<ProspectViewResponseDto>> Get(Guid teamId, ClaimsPrincipal claims);
}
