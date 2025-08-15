import useQuery from "@/api-dsl/use-query";
import { useTeamStore } from "@/stores/team-store";
import { useMemo } from "react";
import { Slot } from "@/lib/prospects/types/generalized-slots/slot";

type ProspectLayout = {
  id: string;
  root: Slot;
};

export function useProspectLayout(): readonly [
  layout: ProspectLayout | null,
  revalidate: () => void,
] {
  const activeTeam = useTeamStore((x) => x.activeTeam);

  const layoutQuery = useQuery("/prospect-layouts/default/{teamId}", {
    queryKey: ["default-prospect-template", activeTeam?.id],
    parameters: {
      // Actual api request won't run until active team is set
      teamId: activeTeam?.id ?? "",
    },
    enabled: !!activeTeam,
    refetchOnMount: false,
  });

  const layout = useMemo<ProspectLayout | null>(
    () =>
      layoutQuery.data
        ? {
            id: layoutQuery.data.id,
            root: JSON.parse(layoutQuery.data.jsonStructure),
          }
        : null,
    [layoutQuery.data],
  );

  const tuple = useMemo(
    () => [layout, layoutQuery.refetch] as const,
    [layout, layoutQuery.refetch],
  );

  return tuple;
}
