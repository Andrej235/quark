import { NavigationItem, NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { hasFlag } from "@/lib/enums/has-flag";
import { TeamPermission } from "@/lib/permissions/team-permission";
import { useTeamStore } from "@/stores/team-store";
import { Book, Briefcase, Home, Send, Settings2 } from "lucide-react";
import { useMemo } from "react";

export function AppSidebar() {
  const team = useTeamStore((x) => x.activeTeam);

  const navigation = useMemo<NavigationItem[]>(() => {
    if (!team?.permissions) return [];

    const items: NavigationItem[] = [
      {
        title: "Dashboard",
        url: "/",
        icon: Home,
        forceOpen: true,
      },
    ];

    const hasPerm = (perm: TeamPermission) => hasFlag(team.permissions, perm);

    if (hasPerm(TeamPermission.CanViewProspects)) {
      items.push({
        title: "Prospects",
        url: "/prospects",
        icon: Briefcase,
        forceOpen: true,
        items: [
          {
            title: "Archived",
            url: "/prospects/archived",
          },
          ...(hasPerm(TeamPermission.CanEditProspectLayout)
            ? [
                {
                  title: "Layout",
                  url: "/prospects/layout",
                },
              ]
            : []),
        ],
      });
    }

    if (hasPerm(TeamPermission.CanViewEmails)) {
      items.push({
        title: "Emails",
        url: "/emails",
        icon: Send,
        forceOpen: true,
        items: [
          {
            title: "Sent",
            url: "/emails/sent",
          },
          {
            title: "Drafts",
            url: "/emails/drafts",
          },
          {
            title: "Scheduled",
            url: "/emails/scheduled",
          },
          {
            title: "Templates",
            url: "/emails/templates",
          },
        ],
      });
    }

    items.push({
      title: "Documentation",
      url: "/documentation",
      icon: Book,
      items: [
        {
          title: "Getting Started",
          url: "/documentation",
        },
        {
          title: "Teams",
          url: "/documentation/teams",
        },
        {
          title: "Prospects",
          url: "/documentation/prospects",
        },
        {
          title: "Emails",
          url: "/documentation/emails",
        },
        {
          title: "Guides",
          url: "/documentation/guides",
        },
      ],
    });

    const settings = {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "User",
          url: "/settings",
        },
      ],
    };

    if (hasPerm(TeamPermission.CanEditSettings)) {
      settings.items.push({
        title: "Team",
        url: "/settings/team",
      });
    }

    if (hasPerm(TeamPermission.CanViewUsers)) {
      settings.items.push({
        title: "Team Members",
        url: "/settings/team-members",
      });
    }

    if (hasPerm(TeamPermission.CanEditRoles)) {
      settings.items.push({
        title: "Team Roles",
        url: "/settings/team-roles",
      });
    }

    settings.items.push({
      title: "Notifications",
      url: "/settings/notifications",
    });

    items.push(settings);

    return items;
  }, [team?.permissions]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
