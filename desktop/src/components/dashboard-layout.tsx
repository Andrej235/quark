import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import DashboardHeader from "./dashboard-header";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <DashboardHeader />

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
