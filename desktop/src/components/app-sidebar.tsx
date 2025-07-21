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
import { Book, Briefcase, Home, Send, Settings2 } from "lucide-react";

const navigation: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    forceOpen: true,
  },
  {
    title: "Prospects",
    url: "/prospects",
    icon: Briefcase,
    forceOpen: true,
    items: [
      {
        title: "Archived",
        url: "/prospects/archived",
      },
      {
        title: "Template",
        url: "/prospects/template",
      },
    ],
  },
  {
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
  },
  {
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
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      {
        title: "User",
        url: "/settings",
      },
      {
        title: "Team",
        url: "/settings/team",
      },
      {
        title: "Team Members",
        url: "/settings/team-members",
      },
      {
        title: "Team Roles",
        url: "/settings/team-roles",
      },
      {
        title: "Notifications",
        url: "/settings/notifications",
      },
    ],
  },
];

export function AppSidebar() {
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
