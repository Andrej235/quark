import { LayoutSlots } from "@/lib/prospect-template/layout-slots";
import { create } from "zustand";

type SlotLayoutEditStore = {
  layoutRoot: LayoutSlots | null;
  enterEditLayoutMode: (slot: LayoutSlots) => void;
  exitEditLayoutMode: () => void;
};

export const useSlotLayoutEditStore = create<SlotLayoutEditStore>()((set) => ({
  layoutRoot: null,
  enterEditLayoutMode: (slot: LayoutSlots) => set({ layoutRoot: slot }),
  exitEditLayoutMode: () => set({ layoutRoot: null }),
}));
