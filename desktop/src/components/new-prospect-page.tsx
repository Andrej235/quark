import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { slotEventSystemContext } from "@/contexts/slot-event-system-context";
import { SlotData } from "@/lib/prospects/slot-data";
import { useProspectsStore } from "@/stores/prospects-store";
import { useCallback, useMemo, useState } from "react";
import { Button } from "./ui/button";
import RenderSlotTree from "./prospect-template/render-slot-tree";
import { Prospect } from "@/lib/prospects/prospect-data-definition";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import sendApiRequest from "@/api-dsl/send-api-request";
import { useTeamStore } from "@/stores/team-store";

export default function NewProspectsPage() {
  const activeTeam = useTeamStore((x) => x.activeTeam);

  const navigate = useNavigate();
  const template = useProspectsStore((x) => x.template);
  const setProspects = useProspectsStore((x) => x.setProspects);

  const [subscribedSlots, setSubscribedSlots] = useState<
    (() => SlotData | null)[]
  >([]);

  const subscribe = useCallback(
    (x: () => SlotData | null) => setSubscribedSlots((prev) => [...prev, x]),
    [],
  );
  const contextValue = useMemo(
    () => ({
      onReadSubscribers: subscribedSlots,
      onReadSubscribe: subscribe,

      onSetSubscribers: [],
      onSetSubscribe: () => {},
    }),
    [subscribedSlots, subscribe],
  );

  function handleSave() {
    if (!activeTeam) {
      toast.error("Please choose a team first");
      return;
    }

    const values = subscribedSlots.map((x) => x()).filter((x) => !!x);

    navigate("/prospects");
    toast.success("Prospect created successfully!");

    sendApiRequest("/prospects", {
      method: "post",
      payload: {
        teamId: activeTeam.id,
        fields: values,
      },
    });

    const newProspect: Prospect = {
      id: Date.now().toString(),
      fields: values,
    };
    setProspects((x) => [...x, newProspect]);
  }

  return (
    <Card className="border-0 bg-transparent">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">New Prospect</CardTitle>
            <CardDescription>
              Create a new prospect by filling out all fields defined in the
              template
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="bg-transparent">
        <slotEventSystemContext.Provider value={contextValue}>
          <RenderSlotTree slot={template} />
        </slotEventSystemContext.Provider>
      </CardContent>

      <CardFooter className="justify-end">
        <Button onClick={handleSave}>Save</Button>
      </CardFooter>
    </Card>
  );
}
