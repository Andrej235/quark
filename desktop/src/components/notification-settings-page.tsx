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
        {notificationSelection.map((section, index) => (
          <div
            key={index}
            className="bg-secondary item-start flex w-1/3 flex-col justify-start gap-4 rounded-xl p-4 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
          >
            <h1 className="text-xl font-semibold">{section.titleCard}</h1>
            <NotificationAccordionList groups={section.groups} />
          </div>
        ))}
      </div>
    </div>
  );
}
