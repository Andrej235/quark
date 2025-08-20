import useQuery from "@/api-dsl/use-query";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useTeamStore } from "@/stores/team-store";
import { format } from "date-fns";
import { Dot, LogOut, Plus, User, UserCog2 } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";

export default function TeamMemberSettingsTab() {
  const team = useTeamStore((x) => x.activeTeam);
  const teamId = team?.id;

  const membersQuery = useQuery("/teams/{teamId}/members", {
    parameters: {
      teamId: teamId || "",
    },
    queryKey: ["team-members", teamId],
    enabled: !!teamId,
  });
  const members = membersQuery.data || [];

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

  if (!team) return null;

  return (
    <Card className="border-0 bg-transparent">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Team Members</CardTitle>
            <CardDescription>
              Manage members of &quot;{team.name}&quot;
            </CardDescription>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </DialogTrigger>

            <DialogContent>Test</DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 bg-transparent">
        <div className="mt-2 flex justify-between">
          <h1 className="text-2xl">Manage access</h1>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Add people</Button>
            </AlertDialogTrigger>

            <AlertDialogContent>TODO: Implement this</AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="flex flex-col gap-2">
          <Input
            placeholder="Search..."
            className="h-12"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <p className="text-muted-foreground text-end text-xs">
            Showing {filteredMembers.length} of {members.length}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {filteredMembers.map((member) => (
            <ContextMenu key={member.username}>
              <ContextMenuTrigger asChild>
                <Card className="hover:border-primary/80 group relative transition-colors">
                  <CardHeader>
                    <div className="bg-muted mx-auto rounded-full">
                      {member.profilePicture && (
                        <img
                          src={member.profilePicture}
                          alt={member.username}
                          className="size-16 rounded-full"
                        />
                      )}

                      {!member.profilePicture && <User className="size-16" />}
                    </div>

                    <CardTitle className="mt-4 text-center">
                      {member.firstName} {member.lastName}
                    </CardTitle>

                    <CardDescription className="flex justify-center">
                      <span>{member.username}</span>
                      <Dot />
                      <a href={`mailto:${member.email}`}>
                        <span>{member.email}</span>
                      </a>
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">{member.roleName}</p>

                      <p className="text-muted-foreground">
                        {format(member.joinedAt, "MM.dd.yyyy.")}
                      </p>
                    </div>
                  </CardContent>

                  <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="sm" className="size-8 p-0">
                      <UserCog2 />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-destructive/10 hover:text-destructive size-8 p-0"
                    >
                      <LogOut />
                    </Button>
                  </div>
                </Card>
              </ContextMenuTrigger>

              <ContextMenuContent>
                <ContextMenuItem>
                  <span>Edit Role</span>
                  <UserCog2 className="ml-auto" />
                </ContextMenuItem>

                <ContextMenuItem variant="destructive">
                  <span>Remove</span>
                  <LogOut className="ml-auto" />
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
