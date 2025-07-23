import { BaseSlot } from "@/lib/prospect-template/base-slot";
import { createContext, useContext } from "react";

export const slotEditContext = createContext<{
  isEditModeActive: boolean;
  topSlot: BaseSlot | null;
  selectedSlot: BaseSlot | null;
  addToHoverStack: (slot: BaseSlot) => void;
  removeFromHoverStack: (slot: BaseSlot) => void;
  selectSlot: (slot: BaseSlot | null) => void;
}>({
  isEditModeActive: false,
  topSlot: null,
  selectedSlot: null,
  // No-op by default
  addToHoverStack: () => {},
  removeFromHoverStack: () => {},
  selectSlot: () => {},
});

export const useIsSlotInEditMode = () =>
  useContext(slotEditContext).isEditModeActive;

export const useSlotHoverStack = () => {
  const context = useContext(slotEditContext);

  return {
    topSlot: context.topSlot,
    addToHoverStack: context.addToHoverStack,
    removeFromHoverStack: context.removeFromHoverStack,
  } as const;
};

export const useSelectedSlot = () => {
  const context = useContext(slotEditContext);

  return [context.selectedSlot, context.selectSlot] as const;
};
