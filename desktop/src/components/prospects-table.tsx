import useQuery from "@/api-dsl/use-query";
import toTitleCase from "@/lib/title-case";
import { useProspectTableStore } from "@/stores/prospect-table-store";
import { useProspectsStore } from "@/stores/prospects-store";
import { useTeamStore } from "@/stores/team-store";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
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
import { useInvalidateProspectTable } from "@/lib/prospects/use-invalidate-prospect-table";

export default function ProspectsTable() {
  const dataFields = useProspectsStore((x) => x.listView);

  const teamId = useTeamStore().activeTeam?.id ?? "";

  const pageIndex = useProspectTableStore((x) => x.pageIndex);
  const setPageIndex = useProspectTableStore((x) => x.setPageIndex);

  const currentCursor = useProspectTableStore((x) => x.currentCursor);
  const addCursor = useProspectTableStore((x) => x.addCursor);

  const invalidate = useInvalidateProspectTable();
  useEffect(() => {
    if (teamId) invalidate();
  }, [teamId, invalidate]);

  const prospectsQuery = useQuery("/prospects/partial/{teamId}", {
    queryKey: ["partial-prospects", teamId, currentCursor ?? "first-page"],
    parameters: {
      teamId,
      include: dataFields[0]?.id,
      sortBy: dataFields[0]?.id,
      ...(currentCursor && { cursor: currentCursor }),
    },
    enabled: !!teamId,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!prospectsQuery.data?.cursorToken) return;
    
    const newToken = prospectsQuery.data.cursorToken;
    addCursor(newToken);
  }, [prospectsQuery.data?.cursorToken, addCursor]);

  const mappedProspects = useMemo(
    () =>
      prospectsQuery.data?.items.map((x) => ({
        id: x.id,
        ...Object.fromEntries(x.fields.map((y) => [y.id, y.value])),
      })),
    [prospectsQuery],
  );

  const handleDelete = useCallback((id: string) => {
    console.log("delete", id);
  }, []);

  const columns = useMemo<ColumnDef<{ id: string }>[]>(() => {
    const columns: ColumnDef<{ id: string }>[] = dataFields.map((x) => ({
      header: toTitleCase(x.id.replace("-", " ")),
      accessorKey: x.id,
    }));

    columns.push({
      header: "Actions",
      cell: ({ row }) => {
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

              <DropdownMenuItem asChild>
                <Link to={row.original.id}>
                  <span>View</span>
                  <Eye className="ml-auto size-4" />
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to={`${row.original.id}/edit`}>
                  <span>Edit</span>
                  <Edit2 className="ml-auto size-4" />
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDelete(row.original.id)}
              >
                <span>Delete</span>
                <Trash2 className="ml-auto size-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });

    return columns;
  }, [dataFields, handleDelete]);

  return (
    <DataTable
      columns={columns}
      data={mappedProspects ?? []}
      pageIndex={pageIndex}
      setPageIndex={setPageIndex}
      hasMore={prospectsQuery.data?.hasMore ?? false}
      isLoading={prospectsQuery.isLoading}
    />
  );
}
