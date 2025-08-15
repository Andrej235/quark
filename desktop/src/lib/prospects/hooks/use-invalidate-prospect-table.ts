import {
  useArchivedProspectTableStore,
  useProspectTableStore,
} from "@/stores/prospect-table-store";
import { useTeamStore } from "@/stores/team-store";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function useInvalidateProspectTable() {
  const activeTeam = useTeamStore((x) => x.activeTeam);
  const queryClient = useQueryClient();

  const setPageIndex = useProspectTableStore((x) => x.setPageIndex);
  const clearCursors = useProspectTableStore((x) => x.clearCursors);

  const setPageIndexArchived = useArchivedProspectTableStore(
    (x) => x.setPageIndex,
  );
  const clearCursorsArchived = useArchivedProspectTableStore(
    (x) => x.clearCursors,
  );

  return useCallback(
    async ({ invalidateArchived = false } = {}) => {
      if (!activeTeam) return;

      clearCursors();
      setPageIndex(0);

      if (invalidateArchived) {
        clearCursorsArchived();
        setPageIndexArchived(0);
      }

      const key = ["partial-prospects", activeTeam.id];
      if (!invalidateArchived) key.push("not-archived");

      await queryClient.invalidateQueries({
        queryKey: key,
      });
    },
    [
      activeTeam,
      setPageIndex,
      clearCursors,
      setPageIndexArchived,
      clearCursorsArchived,
      queryClient,
    ],
  );
}
