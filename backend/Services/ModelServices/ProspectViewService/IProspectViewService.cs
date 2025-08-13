using System.Security.Claims;
using FluentResults;
using Quark.Dtos.Request.ProspectListViewItem;
using Quark.Dtos.Response.ProspectListViewItem;

namespace Quark.Services.ModelServices.ProspectViewService;

public partial interface IProspectViewService
{
    Task<Result> Create(AddProspectViewItemsRequestDto request, ClaimsPrincipal claims);
    Task<Result<ProspectViewResponseDto>> Get(Guid teamId, ClaimsPrincipal claims);
    Task<Result> Replace(
        Guid teamId,
        AddProspectViewItemsRequestDto request,
        ClaimsPrincipal claims
    );
    Task<Result> Delete(Guid teamId, string ids, ClaimsPrincipal claims);
}
