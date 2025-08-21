import sendApiRequest from "@/api-dsl/send-api-request";
import { Schema } from "@/api-dsl/types/endpoints/schema-parser";
import useQuery from "@/api-dsl/use-query";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import toTitleCase from "@/lib/format/title-case";
import { useTeamStore } from "@/stores/team-store";
import { Ban, Check, Clock, User2, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Toggle } from "./ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const possibleStatuses: Schema<"TeamInvitationStatus">[] = [
  "accepted",
  "declined",
  "pending",
  "revoked",
];

export default function TeamInvitationsDialogContent({
  isOpen,
}: {
  isOpen: boolean;
}) {
  const team = useTeamStore((x) => x.activeTeam);
  const invitationsQuery = useQuery("/team-invitations/for-team/{teamId}", {
    parameters: {
      teamId: team?.id || "",
    },
    queryKey: ["team-invitations", team?.id],
    enabled: isOpen && !!team?.id,
  });

  const [invitations, setInvitations] = useState<
    Schema<"TeamInvitationResponseDto">[]
  >([]);

  useEffect(() => {
    if (!invitationsQuery.data) return;

    // Sync store with query data
    setInvitations(invitationsQuery.data);
  }, [invitationsQuery.data, setInvitations]);

  const [statusFilter, setStatusFilter] =
    useState<Schema<"TeamInvitationStatus">[]>(possibleStatuses);

  const [search, setSearch] = useState("");

  const filteredInvitations = invitations.filter((invitation) => {
    const matchesStatus = statusFilter.includes(invitation.status);
    const matchesSearch = search
      ? invitation.userName.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  async function handleRevoke(invitation: Schema<"TeamInvitationResponseDto">) {
    if (!team) return;

    const { isOk } = await sendApiRequest(
      "/team-invitations/revoke/{teamId}/{id}",
      {
        method: "post",
        parameters: {
          teamId: team.id,
          id: invitation.id,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Revoking invitation, please wait...",
          success: "Invitation revoked successfully!",
          error: (x) =>
            x.message || "Failed to revoke invitation, please try again",
        },
      },
    );

    if (!isOk) return;

    setInvitations(
      invitations.map((inv) =>
        inv.id === invitation.id ? { ...inv, status: "revoked" } : inv,
      ),
    );
  }

  function getStatusIcon(status: Schema<"TeamInvitationStatus">) {
    switch (status) {
      case "pending":
        return <Clock className="size-4" />;
      case "accepted":
        return <Check className="size-4" />;
      case "declined":
        return <X className="size-4" />;
      case "revoked":
        return <Ban className="size-4" />;
    }
  }

  return (
    <DialogContent>
      <DialogHeader className="mb-8">
        <DialogTitle>Manage your team&apos;s invitations</DialogTitle>
        <DialogDescription>
          Here you can view and manage all invitations sent by your team.
        </DialogDescription>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status-filter">Filter by status</Label>
            <div
              id="status-filter"
              className="flex w-full min-w-full max-w-full flex-wrap gap-2"
            >
              {possibleStatuses.map((status) => (
                <Toggle
                  key={status}
                  pressed={statusFilter?.includes(status)}
                  onPressedChange={(isPressed) => {
                    if (isPressed) {
                      setStatusFilter((prev) => [...(prev || []), status]);
                    } else {
                      setStatusFilter(
                        (prev) => prev?.filter((s) => s !== status) || null,
                      );
                    }
                  }}
                >
                  <span>{toTitleCase(status)}</span>
                  {getStatusIcon(status)}
                </Toggle>
              ))}
            </div>
          </div>

          <div className="relative space-y-2">
            <Label htmlFor="search">Search by username</Label>
            <Input
              id="search"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <p className="text-muted-foreground absolute right-0 border-0 text-xs">
              Showing {filteredInvitations.length} of {invitations.length ?? 0}{" "}
              invitations
            </p>
          </div>
        </div>
      </DialogHeader>

      {!invitationsQuery.isLoading && filteredInvitations.length === 0 && (
        <div className="h-96">
          <p className="text-muted-foreground text-center">No invitations</p>
        </div>
      )}

      {!invitationsQuery.isLoading && filteredInvitations.length > 0 && (
        <ul className="h-96 max-h-96 space-y-2 overflow-y-auto">
          {filteredInvitations.map((invitation) => (
            <InvitationContextMenu
              key={invitation.id}
              show={invitation.status === "pending"}
              onRevoke={() => handleRevoke(invitation)}
            >
              <li>
                <Card key={invitation.id} className="w-full p-4">
                  <div className="flex items-center gap-2">
                    {invitation.userProfilePicture && (
                      <img
                        src={invitation.userProfilePicture}
                        className="size-8"
                        alt="user profile picture"
                      />
                    )}

                    {!invitation.userProfilePicture && (
                      <User2 className="size-8" />
                    )}

                    <div>
                      <CardTitle className="flex items-center gap-1 font-medium">
                        <span>{invitation.userName}</span>

                        <Tooltip delayDuration={200}>
                          <TooltipTrigger>
                            {getStatusIcon(invitation.status)}
                          </TooltipTrigger>

                          <TooltipContent>
                            {toTitleCase(invitation.status)}
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Invited by &quot;{invitation.invitedBy}&quot;
                      </CardDescription>
                    </div>

                    {invitation.status === "pending" && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="ml-auto"
                            onClick={() => handleRevoke(invitation)}
                          >
                            <Ban />
                          </Button>
                        </TooltipTrigger>

                        <TooltipContent>Revoke invitation</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </Card>
              </li>
            </InvitationContextMenu>
          ))}
        </ul>
      )}
    </DialogContent>
  );
}

function InvitationContextMenu({
  show,
  onRevoke,
  children,
}: {
  show: boolean;
  onRevoke: () => void;
  children: ReactNode;
}) {
  if (!show) return children;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem variant="destructive" onClick={onRevoke}>
          <span>Revoke</span>
          <Ban className="ml-auto" />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
