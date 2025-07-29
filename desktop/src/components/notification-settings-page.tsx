import { NotificationAccordionList } from "./notification-accordion-list";

const notificationSelection = [
  {
    titleCard: "Team notifications",
    groups: [
      { title: "User invited" },
      { title: "User invitation accepted" },
      { title: "User kicked out" },
      { title: "User role changed" },
    ],
  },
  {
    titleCard: "User notifications",
    groups: [
      { title: "Invited to team" },
      { title: "Role changed" },
      { title: "Kicked out" },
    ],
  },
  {
    titleCard: "Client notifications",
    groups: [
      { title: "Add prospect" },
      { title: "Edit prospect" },
      { title: "Delete prospect" },
    ],
  },
  {
    titleCard: "Mail notifications",
    groups: [
      { title: "Add email" },
      { title: "Edit email" },
      { title: "Delete email" },
      { title: "Send email" },
      { title: "Schedule email" },
    ],
  },
];

export default function NotificationSettingsPage() {
  return (
    <div className="bg-muted/50 flex h-full min-h-[100vh] flex-row rounded-xl md:min-h-min">
      <div className="flex w-full flex-col items-center gap-6 py-12">
        <div className="flex w-1/3 items-center justify-center p-2">
          <h1 className="text-4xl">Notification center</h1>
        </div>
        <div className="flex w-1/2 flex-col gap-4">
          <NotificationAccordionList sections={notificationSelection} />
        </div>
      </div>
    </div>
  );
}
