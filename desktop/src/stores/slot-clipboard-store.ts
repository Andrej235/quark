import { Slot } from "@/lib/prospects/slot-types/slot";
import { toast } from "sonner";
import { create } from "zustand";

type SlotClipboardStore = {
  copiedSlot: Slot | null;
  copy: (slot: Slot) => void;
  clear: () => void;
};

export const useSlotClipboardStore = create<SlotClipboardStore>((set) => ({
  copiedSlot: null,
  clear: () => set({ copiedSlot: null }),
  copy: (slot: Slot) => {
    set({ copiedSlot: slot });
    toast.success("Slot copied to clipboard");
  },
}));
