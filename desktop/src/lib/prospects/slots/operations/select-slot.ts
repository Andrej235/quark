import { useSlotSelectorStore } from "@/stores/slot-selector-store";
import { Slot } from "../../types/generalized-slots/slot";

export function promptUserToSelectSlot(): Promise<Slot | null> {
  return new Promise((resolve) => {
    useSlotSelectorStore.getState().open();

    useSlotSelectorStore.subscribe((state, prevState) => {
      if (state.isOpen || !prevState.isOpen) return;
      resolve(state.lastSelectedSlot);
    });
  });
}
