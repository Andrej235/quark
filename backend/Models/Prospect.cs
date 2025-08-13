namespace Quark.Models;

public class Prospect
{
    public Guid Id { get; set; }

    public Guid? LayoutId { get; set; }
    public ProspectLayout? Layout { get; set; } = null!;

    public Guid TeamId { get; set; }
    public Team Team { get; set; } = null!;

    public ICollection<ProspectDataField> Fields { get; set; } = null!;
}
