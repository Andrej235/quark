import sendApiRequest from "@/api-dsl/send-api-request";
import { Schema } from "@/api-dsl/types/endpoints/schema-parser";
import useQuery from "@/api-dsl/use-query";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import toTitleCase from "@/lib/format/title-case";
import { useTeamInvitationsStore } from "@/stores/team-invitations-store";
import { useUserStore } from "@/stores/user-store";
import { Ban, Check, Clock, EllipsisVertical, Users2, X } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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

export default function UserTeamInvitationsDialogContent({
  isOpen,
}: {
  isOpen: boolean;
}) {
  const invitationsQuery = useQuery("/team-invitations", {
    queryKey: ["team-invitations"],
    enabled: isOpen,
  });

  const invitations = useTeamInvitationsStore((x) => x.invitations);
  const setInvitations = useTeamInvitationsStore((x) => x.setInvitations);
  const user = useUserStore((x) => x.user);
  const setUser = useUserStore((x) => x.setUser);

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
      ? invitation.teamName.toLowerCase().includes(search.toLowerCase()) ||
        invitation.invitedBy.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  async function handleAccept(
    invitation: Schema<"UserTeamInvitationResponseDto">,
  ) {
    if (!user) return;

    const { isOk, response } = await sendApiRequest(
      "/team-invitations/accept/{id}",
      {
        method: "post",
        parameters: {
          id: invitation.id,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Accepting invitation, please wait...",
          success: "Invitation accepted successfully!",
          error: (x) =>
            x.message || "Failed to accept invitation, please try again",
        },
      },
    );

    if (!isOk || !response) return;

    setUser({ ...user, teams: [...user.teams, response] });
    setInvitations(
      invitations.map((inv) =>
        inv.id === invitation.id ? { ...inv, status: "accepted" } : inv,
      ),
    );
  }

  async function handleDecline(
    invitation: Schema<"UserTeamInvitationResponseDto">,
  ) {
    const { isOk } = await sendApiRequest(
      "/team-invitations/decline/{id}",
      {
        method: "post",
        parameters: {
          id: invitation.id,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Declining invitation, please wait...",
          success: "Invitation declined successfully!",
          error: (x) =>
            x.message || "Failed to decline invitation, please try again",
        },
      },
    );

    if (!isOk) return;
    setInvitations(
      invitations.map((inv) =>
        inv.id === invitation.id ? { ...inv, status: "declined" } : inv,
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
        <DialogTitle>Manage your team invitations</DialogTitle>
        <DialogDescription>
          Here you can view and manage all your team invitations.
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
            <Label htmlFor="search">Search by team name or username</Label>
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
          <p className="text-muted-foreground text-center">
            No team invitations
          </p>
        </div>
      )}

      {!invitationsQuery.isLoading && filteredInvitations.length > 0 && (
        <ul className="h-96 max-h-96 space-y-2 overflow-y-auto">
          {filteredInvitations.map((invitation) => (
            <InvitationContextMenu
              key={invitation.id}
              show={invitation.status === "pending"}
              onAccept={() => handleAccept(invitation)}
              onDecline={() => handleDecline(invitation)}
            >
              <li>
                <Card key={invitation.id} className="w-full p-4">
                  <div className="flex items-center gap-2">
                    {invitation.teamLogo && (
                      <img
                        src={invitation.teamLogo}
                        className="size-8"
                        alt="team logo"
                      />
                    )}

                    {!invitation.teamLogo && <Users2 className="size-8" />}

                    <div>
                      <CardTitle className="flex items-center gap-1 font-medium">
                        <span>{invitation.teamName}</span>

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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="ml-auto"
                          >
                            <EllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleAccept(invitation)}
                          >
                            <span>Accept</span>
                            <Check className="ml-auto" />
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleDecline(invitation)}
                          >
                            <span>Decline</span>
                            <X className="ml-auto" />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
  onAccept,
  onDecline,
  children,
}: {
  show: boolean;
  onAccept: () => void;
  onDecline: () => void;
  children: ReactNode;
}) {
  if (!show) return children;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem onClick={onAccept}>
          <span>Accept</span>
          <Check className="ml-auto" />
        </ContextMenuItem>

        <ContextMenuItem variant="destructive" onClick={onDecline}>
          <span>Decline</span>
          <X className="ml-auto" />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
