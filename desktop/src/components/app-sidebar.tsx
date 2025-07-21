import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Settings2 } from "lucide-react";

const navigation = [
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
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
      {
        title: "User",
        url: "/settings/user",
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
