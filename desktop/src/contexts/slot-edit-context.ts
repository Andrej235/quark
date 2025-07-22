import { BaseSlot } from "@/lib/prospect-template/base-slot";
import { createContext, useContext } from "react";

export const slotEditContext = createContext<{
  isEditModeActive: boolean;
  topSlot: BaseSlot | null;
  addToHoverStack: (slot: BaseSlot) => void;
  removeFromHoverStack: (slot: BaseSlot) => void;
}>({
  isEditModeActive: false,
  topSlot: null,
  addToHoverStack: () => {}, // No-op by default
  removeFromHoverStack: () => {}, // No-op by default
});

export const useIsSlotInEditMode = () =>
  useContext(slotEditContext).isEditModeActive;

export const useSlotHoverStack = () =>
  ({
    topSlot: useContext(slotEditContext).topSlot,
    addToHoverStack: useContext(slotEditContext).addToHoverStack,
    removeFromHoverStack: useContext(slotEditContext).removeFromHoverStack,
  }) as const;
