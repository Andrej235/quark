using Microsoft.AspNetCore.Mvc;
using Quark.Services.ModelServices.ProspectLayoutService;

namespace Quark.Controllers.ProspectLayoutController;

[Route("prospect-layouts")]
[ApiController]
[ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
public partial class ProspectLayoutController(IProspectLayoutService layoutService)
    : ControllerBase;
