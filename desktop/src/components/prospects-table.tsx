import sendApiRequest from "@/api-dsl/send-api-request";
import useQuery from "@/api-dsl/use-query";
import { useInvalidateProspectTable } from "@/lib/prospects/use-invalidate-prospect-table";
import { useProspectView } from "@/lib/prospects/use-prospect-view";
import toTitleCase from "@/lib/title-case";
import { useProspectTable } from "@/lib/use-prospect-table";
import { useTeamStore } from "@/stores/team-store";
import { ColumnDef } from "@tanstack/react-table";
import { Archive, ArchiveX, Edit2, Eye, MoreHorizontal } from "lucide-react";
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

export default function ProspectsTable({
  archived = false,
}: {
  archived?: boolean;
}) {
  const [dataFields] = useProspectView();

  const teamId = useTeamStore().activeTeam?.id ?? "";

  const { addCursor, currentCursor, pageIndex, setPageIndex } =
    useProspectTable();

  const invalidate = useInvalidateProspectTable();
  useEffect(() => {
    if (teamId) invalidate();
  }, [teamId, invalidate]);

  const archivedKey = useMemo(
    () => (archived ? "archived" : "not-archived"),
    [archived],
  );
  const prospectsQuery = useQuery("/prospects/partial/{teamId}", {
    queryKey: ["partial-prospects", teamId, archivedKey, `page-${pageIndex}`],
    parameters: {
      teamId,
      include: dataFields.map((x) => x.id).join(","),
      sortBy: dataFields[0]?.id,
      archived: archived,
      ...(currentCursor && { cursor: currentCursor }),
    },
    enabled: !!teamId && dataFields.length > 0,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!prospectsQuery.data?.cursorToken) return;

    const newToken = prospectsQuery.data.cursorToken;
    addCursor(newToken);
  }, [prospectsQuery, addCursor]);

  const mappedProspects = useMemo(
    () =>
      prospectsQuery.data?.items.map((x) => ({
        id: x.id.toString(),
        ...Object.fromEntries(x.fields.map((y) => [y.id, y.value])),
      })),
    [prospectsQuery],
  );

  const handleArchive = useCallback(
    async (id: string) => {
      const { isOk } = await sendApiRequest(
        `/prospects/{teamId}/{prospectId}/${archived ? "unarchive" : "archive"}`,
        {
          method: "patch",
          parameters: {
            teamId,
            prospectId: +id,
          },
        },
        {
          showToast: true,
          toastOptions: {
            success: `Prospect ${archived ? "unarchived" : "archived"} successfully!`,
          },
        },
      );

      if (!isOk) return;

      await invalidate({
        invalidateArchived: true,
      });
    },
    [teamId, archived, invalidate],
  );

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

              {!archived && (
                <DropdownMenuItem asChild>
                  <Link to={`${row.original.id}/edit`}>
                    <span>Edit</span>
                    <Edit2 className="ml-auto size-4" />
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => handleArchive(row.original.id)}
                variant="destructive"
              >
                <span>{archived ? "Unarchive" : "Archive"}</span>
                {archived ? (
                  <ArchiveX className="ml-auto size-4" />
                ) : (
                  <Archive className="ml-auto size-4" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });

    return columns;
  }, [dataFields, handleArchive, archived]);

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
