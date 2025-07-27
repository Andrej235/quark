import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import DashboardBreadcrumbs from "@/components/dashboard-breadcrumbs";
import HeaderSearchBar from "@/components/header-search-bar";
import NotificationPageLink from "@/components/notification-page-link";
import { useSlotLayoutModeStore } from "@/stores/slot-layout-edit-store";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useSlotClipboardStore } from "@/stores/slot-clipboard-store";

export default function DashboardHeader() {
  const isInLayoutMode = useSlotLayoutModeStore((x) => x.layoutRootId) !== null;
  const exitLayoutMode = useSlotLayoutModeStore((x) => x.exitLayoutMode);

  const isCutting = useSlotClipboardStore((x) => x.isCutting);
  const clearClipboard = useSlotClipboardStore((x) => x.clear);

  const isInBaseMode = !isInLayoutMode && !isCutting;

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />

        {isInBaseMode && (
          <>
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DashboardBreadcrumbs />
          </>
        )}
      </div>

      {isInBaseMode && (
        <div className="flex items-center gap-2 px-4">
          <HeaderSearchBar />

          <Separator
            orientation="vertical"
            className="mx-2 hidden min-h-4 md:block"
          />

          <NotificationPageLink />
        </div>
      )}

      {isInLayoutMode && (
        <div className="flex flex-1 items-center justify-center gap-2 px-4">
          <p className="flex-1 text-center font-bold">Layout Mode</p>

          <Button variant="ghost" onClick={exitLayoutMode}>
            <X />
          </Button>
        </div>
      )}

      {isCutting && (
        <div className="flex flex-1 items-center justify-center gap-2 px-4">
          <p className="flex-1 text-center font-bold">Cutting</p>

          <Button variant="ghost" onClick={clearClipboard}>
            <X />
          </Button>
        </div>
      )}
    </header>
  );
}
