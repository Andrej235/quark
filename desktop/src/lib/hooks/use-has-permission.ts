import { useTeamStore } from "@/stores/team-store";
import { useCallback } from "react";
import { hasFlag } from "../enums/has-flag";
import { TeamPermission } from "../permissions/team-permission";

export function useHasPermission(): (permission: TeamPermission) => boolean {
  const team = useTeamStore((x) => x.activeTeam);

  const callback = useCallback(
    (permission: TeamPermission) => {
      if (!team?.permissions) return false;

      return hasFlag(team.permissions, permission);
    },
    [team?.permissions],
  );

  return callback;
}
