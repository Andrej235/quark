import useQuery from "@/api-dsl/use-query";
import { useTeamStore } from "@/stores/team-store";
import { Slot } from "./slot-types/slot";
import { useMemo } from "react";

export function useProspectLayout(): Slot | null {
  const activeTeam = useTeamStore((x) => x.activeTeam);

  const layout = useQuery("/prospect-layouts/default/{teamId}", {
    queryKey: ["default-prospect-template", activeTeam?.id],
    parameters: {
      // Actual api request won't run until active team is set
      teamId: activeTeam?.id ?? "",
    },
    enabled: !!activeTeam,
    refetchOnMount: false,
  });

  const data = useMemo(
    () => (layout.data ? JSON.parse(layout.data.jsonStructure) : null),
    [layout.data],
  );

  return data;
}
