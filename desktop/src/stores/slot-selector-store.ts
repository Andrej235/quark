import { Slot } from "@/lib/prospect-template/slot";
import { create } from "zustand";

type SlotSelectorStore = {
  isOpen: boolean;
  lastSelectedSlot: Slot | null;
  open: () => void;
  close: () => void;
  submit: (slot: Slot) => void;
};

export const useSlotSelectorStore = create<SlotSelectorStore>()((set) => ({
  isOpen: false,
  lastSelectedSlot: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  submit: (slot: Slot) => set({ isOpen: false, lastSelectedSlot: slot }),
}));
