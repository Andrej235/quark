using Quark.Models;

namespace Quark.Utilities;

public static class DefaultProspectView
{
    public static ICollection<ProspectListViewItem> GetDefaultProspectView() =>
        [
            new() { Id = "company-name", Type = Models.Enums.ProspectDataType.Text },
            new() { Id = "description", Type = Models.Enums.ProspectDataType.Text },
            new() { Id = "email", Type = Models.Enums.ProspectDataType.Text },
            new() { Id = "phone", Type = Models.Enums.ProspectDataType.Text },
        ];
}
