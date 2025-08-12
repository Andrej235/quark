using Microsoft.AspNetCore.Mvc;
using Quark.Services.ModelServices.ProspectViewService;

namespace Quark.Controllers.ProspectViewController;

[Route("/prospect-views")]
[ApiController]
[ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
public partial class ProspectViewController(IProspectViewService viewService) : ControllerBase;
