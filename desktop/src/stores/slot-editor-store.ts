import { Slot } from "@/lib/prospects/types/generalized-slots/slot";
import { create } from "zustand";

type SlotEditorStore = {
  editingSlot: Slot | null;
  setEditingSlot: (slot: Slot | null) => void;
  exit: () => void;
};

export const useSlotEditorStore = create<SlotEditorStore>()((set) => ({
  editingSlot: null,
  setEditingSlot: (slot: Slot | null) => set({ editingSlot: slot }),
  exit: () => set({ editingSlot: null }),
}));
