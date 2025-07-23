import { BaseSlot } from "@/lib/prospect-template/base-slot";
import { create } from "zustand";

type SlotHoverStackStore = {
  topSlot: BaseSlot | null;
  frozenSlot: BaseSlot | null;
  stack: BaseSlot[];
  addToHoverStack: (slot: BaseSlot) => void;
  removeFromHoverStack: (slot: BaseSlot) => void;
  freezeHoverStack: (slot: BaseSlot | null) => void;
};

export const useSlotHoverStackStore = create<SlotHoverStackStore>(
  (set, get) => ({
    frozenSlot: null,
    topSlot: null,
    stack: [],
    addToHoverStack: (slot: BaseSlot) => {
      const { stack, frozenSlot } = get();
      const newStack = [...stack, slot];
      const topSlot = frozenSlot ?? slot ?? null;

      set({ stack: newStack, topSlot });
    },
    removeFromHoverStack: (slot: BaseSlot) => {
      const { stack, frozenSlot } = get();
      const newStack = [...stack.filter((s) => s !== slot)];
      const topSlot = frozenSlot ?? newStack[newStack.length - 1] ?? null;

      set({ stack: newStack, topSlot });
    },
    freezeHoverStack: (slot: BaseSlot | null) => {
      const { stack } = get();
      const topSlot = slot ?? stack[stack.length - 1] ?? null;

      set({ frozenSlot: slot, topSlot });
    },
  }),
);
