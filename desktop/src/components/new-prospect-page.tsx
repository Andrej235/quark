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

export default function NewProspectsPage() {
  const template = useProspectsStore((x) => x.template);
  const [subscribedSlots, setSubscribedSlots] = useState<
    (() => SlotData | null)[]
  >([]);

  const subscribe = useCallback(
    (x: () => SlotData | null) => setSubscribedSlots((prev) => [...prev, x]),
    [],
  );
  const contextValue = useMemo(
    () => ({
      subscribers: subscribedSlots,
      subscribe,
    }),
    [subscribedSlots, subscribe],
  );

  function handleSave() {
    const values = subscribedSlots.map((x) => x()).filter((x) => !!x);
    console.log(values);
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
