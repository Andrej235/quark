import { LayoutSlots } from "@/lib/prospect-template/layout-slots";
import { create } from "zustand";

type SlotLayoutModeStore = {
  layoutRoot: LayoutSlots | null;
  enterLayoutMode: (slot: LayoutSlots) => void;
  exitLayoutMode: () => void;
};

export const useSlotLayoutModeStore = create<SlotLayoutModeStore>()((set) => ({
  layoutRoot: null,
  enterLayoutMode: (slot: LayoutSlots) => set({ layoutRoot: slot }),
  exitLayoutMode: () => set({ layoutRoot: null }),
}));
