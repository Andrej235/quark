import { Slot } from "@/lib/prospects/types/generalized-slots/slot";
import { toast } from "sonner";
import { create } from "zustand";

type SlotClipboardStore = {
  isCutting: boolean;
  copiedSlot: Slot | null;
  copy: (slot: Slot) => void;
  cut: (slot: Slot) => void;
  clear: () => void;
};

export const useSlotClipboardStore = create<SlotClipboardStore>((set) => ({
  isCutting: false,
  copiedSlot: null,
  clear: () => set({ isCutting: false, copiedSlot: null }),
  copy: (slot: Slot) => {
    set({ copiedSlot: slot });
    toast.success("Slot copied to clipboard");
  },
  cut: (slot: Slot) => {
    set({ isCutting: true, copiedSlot: slot });
    toast.success("Slot cut to clipboard", {
      description: "The original will be removed upon pasting",
    });
  },
}));
