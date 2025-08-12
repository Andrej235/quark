using Quark.Models;
using Quark.Services.Read;

namespace Quark.Services.ModelServices.ProspectViewService;

public partial class ProspectViewService(
    IReadRangeSelectedService<ProspectListViewItem> readService
) : IProspectViewService;
