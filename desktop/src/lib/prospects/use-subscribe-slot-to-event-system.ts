import { useContext, useEffect, useRef } from "react";
import { Slot } from "./slot-types/slot";
import { slotEventSystemContext } from "@/contexts/slot-event-system-context";
import { SlotData } from "./slot-data";

export function useSubscribeSlotToEventSystem(
  slot: Slot,
  valueState: string | null,
): void {
  const subscribe = useContext(slotEventSystemContext).subscribe;
  const valueRef = useRef<SlotData | null>(null);
  const subscribed = useRef(false);

  useEffect(() => {
    valueRef.current = {
      id: slot.id,
      type: slot.type === "image-field" ? "image" : "text",
      value: valueState,
    };
  }, [slot.id, slot.type, valueState]);

  useEffect(() => {
    if (subscribed.current) return;
    subscribed.current = true;

    subscribe(() => valueRef.current);
  }, [subscribe]);
}
