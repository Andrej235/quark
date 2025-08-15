import { LayoutSlot } from "../../types/generalized-slots/layout-slot";
import { Slot } from "../../types/generalized-slots/slot";

export function isLayoutSlot(slot?: Slot | null): slot is LayoutSlot {
  return !!slot && (slot.type === "row" || slot.type === "column");
}
