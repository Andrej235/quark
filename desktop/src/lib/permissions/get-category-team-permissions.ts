import { detailedTeamPermissions } from "./detailed-team-permission";
import { TeamPermission } from "./team-permission";

export function getCategoryTeamPermissions(category: string): TeamPermission {
  return detailedTeamPermissions
    .filter((x) => x.category === category)
    .reduce<TeamPermission>((acc, x) => acc | x.enumValue, TeamPermission.None);
}
