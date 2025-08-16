import useQuery from "@/api-dsl/use-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { slotEventSystemContext } from "@/contexts/slot-event-system-context";
import { useProspectLayout } from "@/lib/prospects/hooks/use-prospect-layout";
import { useTeamStore } from "@/stores/team-store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import RenderSlotTree from "./prospect-layout/render-slot-tree";

export default function ViewProspectPage() {
  const prospectId = useParams().prospectId ?? "";
  const teamId = useTeamStore((x) => x.activeTeam?.id);

  const prospect = useQuery("/prospects/{teamId}/{prospectId}", {
    parameters: {
      teamId: teamId || "",
      prospectId,
    },
    queryKey: ["prospect", teamId, prospectId],
    enabled: !!teamId && !!prospectId,
  });
  const [layout] = useProspectLayout();

  const [onSetSubscribedSlots, setOnSetSubscribedSlots] = useState<
    (() => [id: string, setCallback: (newValue: string | null) => void])[]
  >([]);
  const onSetSubscribe = useCallback(
    (x: () => [id: string, setCallback: (newValue: string | null) => void]) =>
      setOnSetSubscribedSlots((prev) => [...prev, x]),
    [],
  );

  const contextValue = useMemo(
    () => ({
      onReadSubscribe: () => {},
      onSetSubscribe: onSetSubscribe,
    }),
    [onSetSubscribe],
  );

  useEffect(() => {
    if (!prospect.data) return;

    onSetSubscribedSlots.forEach((callback) => {
      const [id, set] = callback();
      const value = prospect.data!.fields.find((x) => x.id === id)?.value;
      set(value ?? null);
    });
  }, [onSetSubscribedSlots, prospect]);

  if (!layout) return null;

  return (
    <Card className="border-0 bg-transparent">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">View Prospect</CardTitle>
            <CardDescription>
              View an existing prospect&apos;s data
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="bg-transparent">
        <slotEventSystemContext.Provider value={contextValue}>
          <RenderSlotTree slot={layout.root} readonly />
        </slotEventSystemContext.Provider>
      </CardContent>
    </Card>
  );
}
