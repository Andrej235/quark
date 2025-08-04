import toTitleCase from "@/lib/title-case";
import { useProspectsStore } from "@/stores/prospects-store";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { DataTable } from "./data-table";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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

  const columns = useMemo<ColumnDef<object>[]>(() => {
    const columns: ColumnDef<object>[] = dataFields.map((x) => ({
      header: toTitleCase(x.id.replace("-", " ")),
      accessorKey: x.id,
    }));

    columns.push({
      header: "Actions",
      cell: () => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <span>Edit</span>
                <Edit2 className="ml-auto size-4" />
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive">
                <span>Delete</span>
                <Trash2 className="ml-auto size-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });

    return columns;
  }, [dataFields]);

  return <DataTable columns={columns} data={mappedProspects} />;
}
