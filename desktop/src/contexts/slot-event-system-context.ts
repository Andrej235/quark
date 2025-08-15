import { SlotData } from "@/lib/prospects/types/data/slot-data";
import { createContext } from "react";

type SlotEventSystemContext = {
  onReadSubscribers: (() => SlotData | null)[];
  onReadSubscribe: (callback: () => SlotData | null) => void;

  onSetSubscribers: (() => [
    id: string,
    setCallback: (newValue: string | null) => void,
  ])[];
  onSetSubscribe: (
    callback: () => [
      id: string,
      setCallback: (newValue: string | null) => void,
    ],
  ) => void;
};

export const slotEventSystemContext = createContext<SlotEventSystemContext>({
  onReadSubscribers: [],
  onReadSubscribe: () => {},

  onSetSubscribers: [],
  onSetSubscribe: () => {},
});
