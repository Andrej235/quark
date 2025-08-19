import { splitFlags } from "../enums/split-flags";
import {
  detailedTeamPermissions,
  Permission,
} from "./detailed-team-permission";
import { TeamPermission } from "./team-permission";

export function getDetailedTeamPermissions(
  enumValue: TeamPermission,
): Permission[] {
  return splitFlags(enumValue)
    .map((x) => detailedTeamPermissions.find((y) => y.enumValue === x))
    .filter((x) => !!x);
}
