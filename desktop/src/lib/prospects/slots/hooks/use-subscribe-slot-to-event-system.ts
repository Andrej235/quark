import { slotEventSystemContext } from "@/contexts/slot-event-system-context";
import { useContext, useEffect, useRef } from "react";
import { SlotData } from "../../types/data/slot-data";
import { Slot } from "../../types/generalized-slots/slot";

type Options = {
  slot: Slot;
  valueState: string | null;
  setState: ((value: string | null) => void) | ((value: string) => void);
  onReadValue?: () => void;
};

export function useSubscribeSlotToEventSystem({
  slot,
  valueState,
  setState,
  onReadValue,
}: Options): void {
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

    onReadSubscribe(() => {
      onReadValue?.();
      return valueRef.current && slot ? [slot, valueRef.current] : null;
    });
  }, [onReadSubscribe, slot, onReadValue]);

  useEffect(() => {
    if (subscribedToOnSet.current === slot.id) return;
    subscribedToOnSet.current = slot.id;

    // The cast into a function with a nullable param will probably cause problems later down the line. For example, text-field-slot doesn't expect null as a value, but image-field-slot does.
    onSetSubscribe(() => [slot.id, setState as (value: string | null) => void]);
  }, [onSetSubscribe, slot.id, setState]);
}
