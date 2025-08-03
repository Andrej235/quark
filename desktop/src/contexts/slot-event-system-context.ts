import { SlotData } from "@/lib/prospects/slot-data";
import { createContext } from "react";

type SlotEventSystemContext = {
  subscribers: (() => SlotData | null)[];
  subscribe: (callback: () => SlotData | null) => void;
};

export const slotEventSystemContext = createContext<SlotEventSystemContext>({
  subscribers: [],
  subscribe: () => {},
});
