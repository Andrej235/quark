import useQuery from "@/api-dsl/use-query";
import { ProspectFieldDefinition } from "@/lib/prospects/prospect-data-definition";
import { useTeamStore } from "@/stores/team-store";
import { useMemo } from "react";

export function useProspectView() {
  const activeTeam = useTeamStore((x) => x.activeTeam);

  const viewQuery = useQuery("/prospect-views/{teamId}", {
    queryKey: ["default-prospect-view", activeTeam?.id],
    parameters: {
      // Actual api request won't run until active team is set
      teamId: activeTeam?.id ?? "",
    },
    enabled: !!activeTeam,
    refetchOnMount: false,
  });

  const view = useMemo<ProspectFieldDefinition[]>(
    () => (viewQuery.data ? viewQuery.data.items : []),
    [viewQuery.data],
  );

  const tuple = useMemo(
    () => [view, viewQuery.refetch] as const,
    [view, viewQuery.refetch],
  );

  return tuple as [
    view: ProspectFieldDefinition[],
    revalidate: typeof viewQuery.refetch,
  ];
}
