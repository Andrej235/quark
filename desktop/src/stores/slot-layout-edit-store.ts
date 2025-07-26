import { LayoutSlot } from "@/lib/prospect-template/layout-slot";
import { Slot } from "@/lib/prospect-template/slot";
import { create } from "zustand";

type SlotLayoutModeStore = {
  layoutRootId: string | null;
  layoutChildren: string[] | null;
  isSlotChildOfLayoutRoot: (slot: Slot) => boolean;
  enterLayoutMode: (slot: LayoutSlot) => void;
  exitLayoutMode: () => void;
};

export const useSlotLayoutModeStore = create<SlotLayoutModeStore>()(
  (set, get) => ({
    layoutRootId: null,
    layoutChildren: null,
    enterLayoutMode: (slot: LayoutSlot) =>
      set({
        layoutRootId: slot.id,
        layoutChildren: slot.content.map((x) =>
          "slot" in x ? x.slot.id : x.id,
        ),
      }),
    exitLayoutMode: () => set({ layoutRootId: null, layoutChildren: null }),
    isSlotChildOfLayoutRoot: (slot: Slot) => {
      const { layoutChildren } = get();
      return layoutChildren?.includes(slot.id) ?? false;
    },
  }),
);
