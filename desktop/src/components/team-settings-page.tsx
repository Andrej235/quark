import TeamMemberSettingsTab from "./team-member-settings-tab";
import TeamRolesSettings from "./team-roles-settings";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export default function TeamSettingsPage() {
  const teamName = "My Team";

  return (
    <Tabs>
      <TabsList defaultValue={"general"} className="gap-4 px-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="roles">Roles</TabsTrigger>
      </TabsList>

      <TeamMemberSettingsTab teamName={teamName} />
      <TeamRolesSettings />
    </Tabs>
  );
}
