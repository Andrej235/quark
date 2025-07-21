import { useTeamStore } from "@/stores/team-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function DashboardPage() {
  const team = useTeamStore((state) => state.activeTeam);

  if (!team) return null;

  return (
    <Card className="border-0 bg-transparent">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Dashboard</CardTitle>
            <CardDescription>
              View recent activity and statistics for team:{" "}
              <span className="font-semibold">{team.name}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 bg-transparent"></CardContent>
    </Card>
  );
}
