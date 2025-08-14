namespace Quark.Models;

public class Prospect
{
    public Guid Id { get; set; }

    public Guid TeamId { get; set; }
    public Team Team { get; set; } = null!;

    public Guid? LayoutId { get; set; }
    public ProspectLayout? Layout { get; set; } = null!;

    public bool Archived { get; set; }

    public ICollection<ProspectDataField> Fields { get; set; } = null!;
}
