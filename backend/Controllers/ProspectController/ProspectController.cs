using Microsoft.AspNetCore.Mvc;
using Quark.Services.ModelServices.ProspectService;

namespace Quark.Controllers.ProspectController;

[Route("prospects")]
[ApiController]
[ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
public partial class ProspectController(IProspectService prospectService) : ControllerBase;
