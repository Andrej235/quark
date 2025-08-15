import { InputSlot } from "../../types/generalized-slots/input-slot";
import { Slot } from "../../types/generalized-slots/slot";

export function isInputSlot(slot?: Slot | null): slot is InputSlot {
  return !!slot && (slot.type === "text-field" || slot.type === "image-field");
}
