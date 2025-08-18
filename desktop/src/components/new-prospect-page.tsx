import sendApiRequest from "@/api-dsl/send-api-request";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { slotEventSystemContext } from "@/contexts/slot-event-system-context";
import { useInvalidateProspectTable } from "@/lib/prospects/hooks/use-invalidate-prospect-table";
import { useProspectLayout } from "@/lib/prospects/hooks/use-prospect-layout";
import { validateSlotData } from "@/lib/prospects/slots/defaults/validate-slot-data";
import { SlotData } from "@/lib/prospects/types/data/slot-data";
import { Slot } from "@/lib/prospects/types/generalized-slots/slot";
import { useTeamStore } from "@/stores/team-store";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import RenderSlotTree from "./prospect-layout/render-slot-tree";
import { Button } from "./ui/button";

export default function NewProspectsPage() {
  const activeTeam = useTeamStore((x) => x.activeTeam);
  const [layout] = useProspectLayout();

  const navigate = useNavigate();
  const invalidateProspectTable = useInvalidateProspectTable();

  const [subscribedSlots, setSubscribedSlots] = useState<
    (() => [Slot, SlotData] | null)[]
  >([]);

  const subscribe = useCallback(
    (x: () => [Slot, SlotData] | null) =>
      setSubscribedSlots((prev) => [...prev, x]),
    [],
  );
  const contextValue = useMemo(
    () => ({
      onReadSubscribe: subscribe,
      onSetSubscribe: () => {},
    }),
    [subscribe],
  );

  async function handleSave() {
    if (!activeTeam) {
      toast.error("Please choose a team first");
      return;
    }

    const values = subscribedSlots.map((x) => x()).filter((x) => !!x);
    const valid = validateSlotData(values);
    if (!valid) {
      toast.error(
        "Please fill in all required fields and make sure your data is valid",
      );
      return;
    }

    const { isOk } = await sendApiRequest(
      "/prospects",
      {
        method: "post",
        payload: {
          teamId: activeTeam.id,
          fields: values.map(([, value]) => value),
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Saving prospect, please wait...",
          success: "Prospect saved successfully!",
          error: (x) =>
            x.message || "Failed to save prospect, please try again",
        },
      },
    );

    if (!isOk) return;

    await invalidateProspectTable();
    await navigate("/prospects");
  }

  if (!layout) return null;

  return (
    <Card className="border-0 bg-transparent">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">New Prospect</CardTitle>
            <CardDescription>
              Create a new prospect by filling out all fields defined in the
              layout
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="bg-transparent">
        <slotEventSystemContext.Provider value={contextValue}>
          <RenderSlotTree slot={layout.root} />
        </slotEventSystemContext.Provider>
      </CardContent>

      <CardFooter className="justify-end">
        <Button onClick={handleSave}>Save</Button>
      </CardFooter>
    </Card>
  );
}
