using Quark.Models;
using Quark.Models.Enums;

namespace Quark.Utilities;

public static class DefaultTeamRoles
{
    public static ICollection<TeamRole> GetDefaultTeamRoles()
    {
        return
        [
            new TeamRole()
            {
                Name = "Owner",
                Description = "Owner of the team. Has complete control.",
                Permissions = TeamPermission.All,
            },
            new TeamRole()
            {
                Name = "Admin",
                Description = "Admin of the team. Can manage users, prospects, and emails.",
                Permissions =
                    TeamPermission.ManageUsers
                    | TeamPermission.ManageProspects
                    | TeamPermission.ManageEmails,
            },
            new TeamRole()
            {
                Name = "Member",
                Description = "Member of the team. Only has read-only access.",
                Permissions =
                    TeamPermission.CanViewUsers
                    | TeamPermission.CanViewProspects
                    | TeamPermission.CanViewEmails,
            },
        ];
    }
}
