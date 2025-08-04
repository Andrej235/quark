import { slotEventSystemContext } from "@/contexts/slot-event-system-context";
import { useContext, useEffect, useRef } from "react";
import { SlotData } from "./slot-data";
import { Slot } from "./slot-types/slot";

export function useSubscribeSlotToEventSystem(
  slot: Slot,
  valueState: string | null,
  setState: ((value: string | null) => void) | ((value: string) => void),
): void {
  const context = useContext(slotEventSystemContext);
  const onReadSubscribe = context.onReadSubscribe;
  const onSetSubscribe = context.onSetSubscribe;

  const valueRef = useRef<SlotData | null>(null);
  const subscribedToOnRead = useRef(false);
  const subscribedToOnSet = useRef<string | null>(null);

  useEffect(() => {
    valueRef.current = {
      id: slot.id,
      type: slot.type === "image-field" ? "image" : "text",
      value: valueState,
    };
  }, [slot.id, slot.type, valueState]);

  useEffect(() => {
    if (subscribedToOnRead.current) return;
    subscribedToOnRead.current = true;

    onReadSubscribe(() => valueRef.current);
  }, [onReadSubscribe]);

  useEffect(() => {
    if (subscribedToOnSet.current === slot.id) return;
    subscribedToOnSet.current = slot.id;

    // The cast into a function with a nullable param will probably cause problems later down the line. For example, text-field-slot doesn't expect null as a value.
    onSetSubscribe(() => [slot.id, setState as (value: string | null) => void]);
  }, [onSetSubscribe, slot.id, setState]);
}
