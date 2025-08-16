import { SlotData } from "@/lib/prospects/types/data/slot-data";
import { Slot } from "@/lib/prospects/types/generalized-slots/slot";
import { createContext } from "react";

type SlotEventSystemContext = {
  onReadSubscribe: (callback: () => [Slot, SlotData] | null) => void;
  onSetSubscribe: (
    callback: () => [
      id: string,
      setCallback: (newValue: string | null) => void,
    ],
  ) => void;
};

export const slotEventSystemContext = createContext<SlotEventSystemContext>({
  onReadSubscribe: () => {},
  onSetSubscribe: () => {},
});
