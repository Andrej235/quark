import { useProspectsStore } from "@/stores/prospects-store";
import { DataTable } from "./data-table";
import { useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import toTitleCase from "@/lib/title-case";

export default function ProspectsTable() {
  const prospects = useProspectsStore((x) => x.prospects);
  const dataFields = useProspectsStore((x) => x.listView);

  const mappedProspects = useMemo(
    () =>
      prospects.map((x) => ({
        id: x.id,
        ...Object.fromEntries(x.fields.map((y) => [y.id, y.value])),
      })),
    [prospects],
  );

  useEffect(() => {
    console.log(mappedProspects);
  }, [mappedProspects]);

  const columns = useMemo<ColumnDef<unknown>[]>(
    () =>
      dataFields.map((x) => ({
        header: toTitleCase(x.id.replace("-", " ")),
        accessorKey: x.id,
      })),
    [dataFields],
  );

  return <DataTable columns={columns} data={mappedProspects} />;
}
