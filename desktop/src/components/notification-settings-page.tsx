import { NotificationAccordionList } from "./notification-accordion-list";

const userSettingsGroups = [
  {
    title: "User invited", 
    items: ["Send notification", "Mute this user", "Remove from team"],
  },
  {
    title: "User role changed",
    items: ["Notify user", "Request confirmation"],
  },
  {
     title: "User kicked out",
    items: ["Send final email", "Archive data"],
  },
]
export default function NotificationSettingsPage() {
  return (
    <div className="bg-muted/50 flex h-full min-h-[100vh] flex-row rounded-xl md:min-h-min">
      <div className="flex w-full flex-col items-center gap-6 py-12">
        <div className="flex w-1/3 items-center justify-center p-2">
          <h1 className="text-4xl">Notification center</h1>
        </div>

        <div className="bg-secondary flex w-1/3 flex-col item-start justify-start gap-8 rounded-xl p-4 shadow-[0_0_5px_rgba(59,130,246,0.5)]">
        <h1 className="text-2xl">User settings for teams</h1>
        <NotificationAccordionList groups={userSettingsGroups} />
        </div>
      </div>
    </div>
  );
}
