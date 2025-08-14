import { useProspectTableStore } from "@/stores/prospect-table-store";
import { useMemo } from "react";

export function useProspectTable(
  { archived = false }: { archived?: boolean } = { archived: false },
) {
  const pageIndex = useProspectTableStore((x) => x.pageIndex);
  const setPageIndex = useProspectTableStore((x) => x.setPageIndex);

  const currentCursor = useProspectTableStore((x) => x.currentCursor);
  const addCursor = useProspectTableStore((x) => x.addCursor);

  const notArchivedResult = useMemo(
    () => ({
      pageIndex,
      setPageIndex,
      currentCursor,
      addCursor,
    }),
    [pageIndex, setPageIndex, currentCursor, addCursor],
  );

  const archivedPageIndex = useProspectTableStore((x) => x.pageIndex);
  const archivedSetPageIndex = useProspectTableStore((x) => x.setPageIndex);

  const archivedCurrentCursor = useProspectTableStore((x) => x.currentCursor);
  const archivedAddCursor = useProspectTableStore((x) => x.addCursor);

  const archivedResult = useMemo(
    () => ({
      pageIndex: archivedPageIndex,
      setPageIndex: archivedSetPageIndex,
      currentCursor: archivedCurrentCursor,
      addCursor: archivedAddCursor,
    }),
    [
      archivedPageIndex,
      archivedSetPageIndex,
      archivedCurrentCursor,
      archivedAddCursor,
    ],
  );

  return archived ? archivedResult : notArchivedResult;
}
