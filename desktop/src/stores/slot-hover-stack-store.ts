import { create } from "zustand";

type SlotHoverStackStore = {
  topSlotId: string | null;
  frozenSlotId: string | null;
  stack: string[];
  addToHoverStack: (slotId: string) => void;
  removeFromHoverStack: (slotId: string) => void;
  freezeHoverStack: (slotId: string | null) => void;
};

export const useSlotHoverStackStore = create<SlotHoverStackStore>(
  (set, get) => ({
    frozenSlotId: null,
    topSlotId: null,
    stack: [],
    addToHoverStack: (slot: string) => {
      const { stack, frozenSlotId } = get();
      const newStack = [...stack, slot];
      const topSlotId = frozenSlotId ?? slot ?? null;

      set({ stack: newStack, topSlotId });
    },
    removeFromHoverStack: (slot: string) => {
      const { stack, frozenSlotId } = get();
      const newStack = [...stack.filter((s) => s !== slot)];
      const topSlotId = frozenSlotId ?? newStack[newStack.length - 1] ?? null;

      set({ stack: newStack, topSlotId });
    },
    freezeHoverStack: (slot: string | null) => {
      const { stack } = get();
      const topSlotId = slot ?? stack[stack.length - 1] ?? null;

      set({ frozenSlotId: slot, topSlotId });
    },
  }),
);
