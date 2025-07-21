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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideLogOut, Plus, UserCog2 } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";

const members: { name: string }[] = [
  {
    name: "Andrej",
  },
  {
    name: "Lecic",
  },
];

export default function TeamMemberSettingsTab() {
  const teamName = "My Team";

  const [searchTerm, setSearchTerm] = useState<string>("");
  const filteredMembers =
    searchTerm.trim().length === 0
      ? members
      : members.filter((member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );

  function canAddUsers() {
    return true;
  }

  function canRemoveUser(member: { name: string }) {
    return member;
  }

  function canManageMemberRoles(member: { name: string }) {
    return member;
  }

  return (
    <Card className="border-0 bg-transparent">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Team Members</CardTitle>
            <CardDescription>
              Manage members of &quot;{teamName}&quot;
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

          {canAddUsers() && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Add people</Button>
              </AlertDialogTrigger>

              <AlertDialogContent>TODO: Implement this</AlertDialogContent>
            </AlertDialog>
          )}
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

        <div className="flex flex-col gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.name}
              className="flex items-center justify-between"
            >
              <div className="flex gap-2">
                <div className="border-border flex h-12 w-12 items-center justify-center rounded-full border-2 p-0"></div>

                <div className="flex flex-col">
                  <Tooltip delayDuration={2000}>
                    <TooltipTrigger>
                      <h2 className="text-left">{member.name}</h2>
                    </TooltipTrigger>

                    <TooltipContent>
                      {member.name + "@todo: add emails"}
                    </TooltipContent>
                  </Tooltip>

                  <p className="text-muted-foreground text-xs">Role</p>
                </div>
              </div>

              <div className="flex gap-2">
                {canManageMemberRoles(member) && (
                  <DropdownMenu>
                    <Button
                      className="hover:bg-primary/60! p-0 transition-colors duration-150"
                      asChild
                    >
                      <DropdownMenuTrigger>
                        <UserCog2 size={24} />
                      </DropdownMenuTrigger>
                    </Button>

                    <DropdownMenuContent>
                      <DropdownMenuItem>Promote to admin</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {canRemoveUser(member) && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="hover:bg-destructive/80! p-0 transition-colors duration-150"
                        variant={"destructive"}
                      >
                        <LucideLogOut size={24} />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      TODO: Implement this
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
