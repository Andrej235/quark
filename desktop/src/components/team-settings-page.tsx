import {
  LucideLogOut,
  LucideSettings2,
  LucideUsers2,
  UserCog2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const members: {
  viewAccessCount: number;
  configAccessCount: number;
  members: { name: string }[];
} = {
  viewAccessCount: -1,
  configAccessCount: -1,
  members: [
    {
      name: "Andrej",
    },
    {
      name: "Lecic",
    },
  ],
};

export default function TeamSettingsPage() {
  function formatUserCount(count: number) {
    const string = count.toString();
    return string.endsWith("1") && !string.endsWith("11")
      ? "1 user"
      : `${count} users`;
  }

  function canAddUsers() {
    return true;
  }

  function canRemoveUser(member: { name: string }) {
    return member;
  }

  function canManageMemberRoles(member: { name: string }) {
    return member;
  }

  const teamName = "My Team";

  return (
    <div className="bg-muted/50 flex-1 rounded-xl md:min-h-min">
      <div className="flex flex-col gap-4 p-4">
        <header className="flex flex-col">
          <h1 className="text-2xl">Members</h1>

          <p className="text-muted-foreground text-md">
            Manage members of &quot;{teamName}&quot;
          </p>
        </header>

        <Separator />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-2">
          <div className="border-border bg-card flex min-h-16 w-full flex-col gap-2 rounded-md border-2 p-4">
            <div className="flex justify-between">
              <h2>Access</h2>
              <LucideUsers2 />
            </div>

            <p className="text-muted-foreground text-sm">
              <span className="font-semibold">
                {formatUserCount(members.viewAccessCount)}
              </span>
              <span> can access this team</span>
            </p>
          </div>

          <div className="border-border bg-card flex min-h-16 w-full flex-col gap-2 rounded-md border-2 p-4">
            <div className="flex justify-between">
              <h2>Configuration permissions</h2>
              <LucideSettings2 />
            </div>

            <p className="text-muted-foreground text-sm">
              <span className="font-semibold">
                {formatUserCount(members.configAccessCount)}
              </span>
              <span> can configure this team</span>
            </p>
          </div>
        </div>

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

        <div className="flex flex-col gap-4">
          {members.members.map((member) => (
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
      </div>
    </div>
  );
}
