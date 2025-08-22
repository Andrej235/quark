import sendApiRequest from "@/api-dsl/send-api-request";
import { Schema } from "@/api-dsl/types/endpoints/schema-parser";
import useQuery from "@/api-dsl/use-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTeamStore } from "@/stores/team-store";
import { format } from "date-fns";
import { Dot, LogOut, User, UserCog2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EditMemberRoleDialogContent from "./edit-member-role-dialog-content";
import TeamInvitationsDialogContent from "./team-invitations-dialog-content";
import { AlertDescription, AlertTitle } from "./ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "./ui/alert-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function TeamMemberSettingsTab() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitationsDialogOpen, setInvitationsDialogOpen] = useState(false);
  const team = useTeamStore((x) => x.activeTeam);
  const teamId = team?.id;

  const [removingUser, setRemovingUser] =
    useState<Schema<"TeamMemberResponseDto"> | null>(null);
  const [editingRole, setEditingRole] =
    useState<Schema<"TeamMemberResponseDto"> | null>(null);

  const membersQuery = useQuery("/teams/{teamId}/members", {
    parameters: {
      teamId: teamId || "",
    },
    queryKey: ["team-members", teamId],
    enabled: !!teamId,
  });

  const [members, setMembers] = useState<Schema<"TeamMemberResponseDto">[]>([]);
  useEffect(() => {
    if (membersQuery.data) setMembers(membersQuery.data);
  }, [membersQuery.data]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const filteredMembers =
    searchTerm.trim().length === 0
      ? members
      : members.filter(
          (member) =>
            member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (member.firstName + " " + member.lastName)
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        );

  const handleInvite = async () => {
    if (!teamId) return;

    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inviteEmail)
    ) {
      toast.error("Please enter a valid email address");
      return;
    }

    const { isOk } = await sendApiRequest(
      "/teams/invite",
      {
        method: "post",
        payload: {
          teamId: teamId,
          email: inviteEmail,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Inviting user, please wait...",
          success: "User invited successfully!",
          error: (x) => {
            return x.message || "Failed to invite user, please try again";
          },
        },
      },
    );

    if (!isOk) return;
    setInviteEmail("");
  };

  async function handleRemoveUser() {
    if (!removingUser || !teamId) return;

    const { isOk } = await sendApiRequest(
      `/teams/{teamId}/members/{username}`,
      {
        method: "delete",
        parameters: {
          teamId: teamId,
          username: removingUser.username,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Removing user, please wait...",
          success: "User removed successfully!",
          error: (x) => {
            return x.message || "Failed to remove user, please try again";
          },
        },
      },
    );

    if (!isOk) return;
    setRemovingUser(null);
    setMembers((prev) =>
      prev.filter((m) => m.username !== removingUser.username),
    );
  }

  async function updateMemberRole(role: Schema<"TeamRoleResponseDto">) {
    if (!teamId || !editingRole) return;

    const { isOk } = await sendApiRequest(
      "/teams/{teamId}/members/role",
      {
        method: "patch",
        parameters: {
          teamId,
        },
        payload: {
          roleId: role.id,
          userName: editingRole.username,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Updating role, please wait...",
          success: "Role updated successfully!",
          error: (x) => {
            return x.message || "Failed to update role, please try again";
          },
        },
      },
    );

    if (!isOk) return;

    setEditingRole(null);
    setMembers((prev) =>
      prev.map((m) =>
        m.username === editingRole.username ? { ...m, roleName: role.name } : m,
      ),
    );
  }

  if (!team) return null;

  return (
    <Card className="border-0 bg-transparent">
      <CardHeader className="flex items-center justify-between gap-0">
        <div>
          <CardTitle className="text-xl">Team Members</CardTitle>
          <CardDescription>
            Manage members of &quot;{team.name}&quot;
          </CardDescription>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Invite Member</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Members</DialogTitle>
                <DialogDescription>
                  Send an invitation to a colleague to join your team. If a
                  pending invitation already exists, the user will be notified
                  again and the invitation will be extended.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                <Label htmlFor="invite-email">Email Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleInvite}>Send Invite</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={invitationsDialogOpen}
            onOpenChange={setInvitationsDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">Manage Invitations</Button>
            </DialogTrigger>

            <TeamInvitationsDialogContent isOpen={invitationsDialogOpen} />
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 bg-transparent">
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <p className="text-muted-foreground text-end text-xs">
            Showing {filteredMembers.length} of {members.length}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {filteredMembers.length === 0 && (
            <p className="text-muted-foreground col-span-4 text-center">
              No members found
            </p>
          )}

          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member) => (
              <motion.div
                key={member.username}
                layout
                layoutId={member.username}
                initial={{
                  opacity: 0,
                  scale: 0.85,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.85,
                }}
              >
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <Card className="hover:border-primary/80 group relative transition-colors">
                      <CardHeader>
                        <div className="mx-auto">
                          {member.profilePicture && (
                            <img
                              src={member.profilePicture}
                              alt={member.username}
                              className="size-16 rounded-full"
                            />
                          )}

                          {!member.profilePicture && (
                            <User className="size-16" />
                          )}
                        </div>

                        <CardTitle className="mt-4 text-center">
                          {member.firstName} {member.lastName}
                        </CardTitle>

                        <CardDescription className="flex justify-center">
                          <span>{member.username}</span>
                          <Dot className="-mx-1" />
                          <a href={`mailto:${member.email}`}>
                            <span>{member.email}</span>
                          </a>
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">
                            {member.roleName}
                          </p>

                          <p className="text-muted-foreground">
                            {format(member.joinedAt, "MM.dd.yyyy")}
                          </p>
                        </div>
                      </CardContent>

                      <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0"
                              onClick={() => setEditingRole(member)}
                            >
                              <UserCog2 />
                            </Button>
                          </TooltipTrigger>

                          <TooltipContent>Edit Role</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-destructive/10 hover:text-destructive size-8 p-0"
                              onClick={() => setRemovingUser(member)}
                            >
                              <LogOut />
                            </Button>
                          </TooltipTrigger>

                          <TooltipContent>Remove Member</TooltipContent>
                        </Tooltip>
                      </div>
                    </Card>
                  </ContextMenuTrigger>

                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => setEditingRole(member)}>
                      <span>Edit Role</span>
                      <UserCog2 className="ml-auto" />
                    </ContextMenuItem>

                    <ContextMenuItem
                      variant="destructive"
                      onClick={() => setRemovingUser(member)}
                    >
                      <span>Remove</span>
                      <LogOut className="ml-auto" />
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>

      <AlertDialog
        open={!!removingUser}
        onOpenChange={() => setRemovingUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertTitle>
              Are you sure you want to remove {removingUser?.username} from{" "}
              {team.name}?
            </AlertTitle>

            <AlertDescription>
              This action cannot be undone and will take effect immediately.
            </AlertDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveUser}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
        <EditMemberRoleDialogContent
          open={!!editingRole}
          defaultSelectedName={editingRole?.roleName}
          onSave={(role) => {
            if (!role) return;
            updateMemberRole(role);
          }}
        />
      </Dialog>
    </Card>
  );
}
