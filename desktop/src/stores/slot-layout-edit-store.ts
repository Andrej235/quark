import { LayoutSlot } from "@/lib/prospect-template/layout-slot";
import { Slot } from "@/lib/prospect-template/slot";
import { SlotFlexWrapper } from "@/lib/prospect-template/slot-flex-wrapper";
import { create } from "zustand";

type SlotLayoutModeStore = {
  layoutRoot: LayoutSlot | null;
  isSlotChildOfLayoutRoot: (slot: Slot) => boolean;
  enterLayoutMode: (slot: LayoutSlot) => void;
  exitLayoutMode: () => void;
};

export const useSlotLayoutModeStore = create<SlotLayoutModeStore>()(
  (set, get) => ({
    layoutRoot: null,
    enterLayoutMode: (slot: LayoutSlot) => set({ layoutRoot: slot }),
    exitLayoutMode: () => set({ layoutRoot: null }),
    isSlotChildOfLayoutRoot: (slot: Slot) => {
      const { layoutRoot } = get();
      return (
        layoutRoot?.content.includes(slot as Slot & SlotFlexWrapper) ?? false
      );
    },
  }),
);
