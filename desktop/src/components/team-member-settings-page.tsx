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
import { useTeamStore } from "@/stores/team-store";
import { format } from "date-fns";
import { Dot, LogOut, User, UserCog2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { Input } from "./ui/input";

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
      <CardHeader className="flex items-center justify-between gap-0">
        <div>
          <CardTitle className="text-xl">Team Members</CardTitle>
          <CardDescription>
            Manage members of &quot;{team.name}&quot;
          </CardDescription>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Invite Member</Button>
          </AlertDialogTrigger>

          <AlertDialogContent>TODO: Implement this</AlertDialogContent>
        </AlertDialog>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0"
                        >
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
