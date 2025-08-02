import sendApiRequest from "@/api-dsl/send-api-request";
import { Schema } from "@/api-dsl/types/endpoints/schema-parser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useTeamStore } from "@/stores/team-store";
import { useUserStore } from "@/stores/user-store";
import {
  ChevronsUpDown,
  LogOut,
  LucideCheckCircle,
  LucideUsers2,
  Plus,
  Star,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { AlertDescription } from "./ui/alert";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const user = useUserStore((x) => x.user);
  const setUser = useUserStore((x) => x.setUser);
  const activeTeam = useTeamStore((x) => x.activeTeam);
  const setActiveTeam = useTeamStore((x) => x.setActiveTeam);

  const teams = useMemo(() => user?.teamsInfo ?? [], [user?.teamsInfo]);
  const defaultTeam = useMemo(
    () => teams.find((x) => x.id === (user?.defaultTeamId ?? teams[0]?.id)),
    [teams, user?.defaultTeamId],
  );

  useEffect(
    () => setActiveTeam(activeTeam ?? defaultTeam ?? null),
    [defaultTeam, setActiveTeam, activeTeam],
  );

  async function handleSetSetDefault(team: Schema<"TeamInfoDTO">) {
    if (team.id === user?.defaultTeamId) {
      toast.info("Team already set as default");
      return;
    }

    const { isOk } = await sendApiRequest(
      "/user/me/default-team/{team_id}",
      {
        method: "patch",
        parameters: {
          team_id: team.id,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Setting default team, please wait...",
          success: `Successfully set ${team.name} as default team!`,
        },
      },
    );

    if (!isOk) return;

    setUser({ ...user!, defaultTeamId: team.id });
  }

  async function handleLeaveTeam(team: Schema<"TeamInfoDTO">) {
    if (!user) return;

    const isDefault = defaultTeam === team;

    if (isDefault) {
      const { isOk } = await sendApiRequest("/user/me/default-team/{team_id}", {
        method: "patch",
        parameters: {
          team_id: teams[0]?.id,
        },
      });

      if (!isOk) {
        toast.error("Failed to leave team");
        return;
      }
    }

    if (activeTeam === team) {
      setActiveTeam(isDefault ? user.teamsInfo[0] : defaultTeam!);
    }

    const { isOk } = await sendApiRequest(
      "/team/{team_id}",
      {
        method: "delete",
        parameters: {
          team_id: team.id,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Leaving team, please wait...",
          success: `Successfully left ${team.name}!`,
        },
      },
    );

    if (!isOk) return;

    setUser({
      ...user,
      teamsInfo: user.teamsInfo.filter((x) => x.id !== team.id),
      defaultTeamId: isDefault ? user.teamsInfo[0].id : defaultTeam?.id,
    });
  }

  // This will be falsy if the user is not logged in, still loading, or has no teams
  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            asChild
          >
            <DropdownMenuTrigger>
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <LucideUsers2 className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.roleName}</span>
              </div>

              <ChevronsUpDown className="ml-auto" />
            </DropdownMenuTrigger>
          </SidebarMenuButton>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>

            {teams.map((team, index) => (
              <ContextMenu key={team.name}>
                <ContextMenuTrigger asChild>
                  <DropdownMenuItem
                    onClick={() => setActiveTeam(team)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      <LucideUsers2 className="size-3.5 shrink-0" />
                    </div>
                    {team.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </ContextMenuTrigger>

                <ContextMenuContent className="w-64">
                  <ContextMenuItem onClick={() => setActiveTeam(team)}>
                    <span>Select</span>

                    <LucideCheckCircle
                      className={cn(
                        "ml-auto",
                        activeTeam.id === team.id && "stroke-green-300",
                      )}
                    />
                  </ContextMenuItem>

                  <ContextMenuItem onClick={() => handleSetSetDefault(team)}>
                    <span>Set as default</span>

                    <Star
                      className={cn(
                        "ml-auto",
                        user?.defaultTeamId === team.id &&
                          "fill-yellow-300 stroke-yellow-300",
                      )}
                    />
                  </ContextMenuItem>

                  <ContextMenuSeparator />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <ContextMenuItem
                        className="group"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <span>Leave team</span>

                        <LogOut className="group-hover:stroke-destructive ml-auto" />
                      </ContextMenuItem>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to leave {team.name}?
                        </AlertDialogTitle>
                        <AlertDescription>
                          This action is irreversible.
                        </AlertDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button variant="destructive" asChild>
                          <AlertDialogAction
                            onClick={() => handleLeaveTeam(team)}
                          >
                            Leave
                          </AlertDialogAction>
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </ContextMenuContent>
              </ContextMenu>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 p-2" asChild>
              <Link to="/new-team">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>

                <div className="text-muted-foreground font-medium">
                  Add team
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
