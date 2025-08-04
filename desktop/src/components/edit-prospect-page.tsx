import RenderSlotTree from "@/components/prospect-template/render-slot-tree";
import { Button } from "@/components/ui/button";
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export default function EditProspectPage() {
  const prospectId = useParams().prospectId as string;
  const prospect = useProspectsStore((x) =>
    x.prospects.find((x) => x.id === prospectId),
  );

  const template = useProspectsStore((x) => x.template);
  const setProspects = useProspectsStore((x) => x.setProspects);

  const [onReadSubscribedSlots, setOnReadSubscribedSlots] = useState<
    (() => SlotData | null)[]
  >([]);
  const onReadSubscribe = useCallback(
    (x: () => SlotData | null) =>
      setOnReadSubscribedSlots((prev) => [...prev, x]),
    [],
  );

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
      onReadSubscribers: onReadSubscribedSlots,
      onReadSubscribe: onReadSubscribe,

      onSetSubscribers: onSetSubscribedSlots,
      onSetSubscribe: onSetSubscribe,
    }),
    [
      onReadSubscribedSlots,
      onReadSubscribe,
      onSetSubscribedSlots,
      onSetSubscribe,
    ],
  );

  useEffect(() => {
    if (!prospect) return;

    onSetSubscribedSlots.forEach((callback) => {
      const [id, set] = callback();
      const value = prospect.fields.find((x) => x.id === id)?.value;
      set(value ?? null);
    });
  }, [onSetSubscribedSlots, prospect]);

  function handleSave() {
    const values = onReadSubscribedSlots.map((x) => x()).filter((x) => !!x);

    setProspects((x) => {
      const idx = x.findIndex((y) => y.id === prospectId);
      x[idx].fields = values;

      return [...x];
    });
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
