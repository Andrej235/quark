import { InputSlot } from "../../types/generalized-slots/input-slot";
import { Slot } from "../../types/generalized-slots/slot";

export function isInputSlot(slot?: Slot | null): slot is InputSlot {
  const inputTypes: string[] = [
    "text-field",
    "image-field",
    "dropdown",
    "rich-text-field",
  ] satisfies InputSlot["type"][];

  return !!slot && inputTypes.includes(slot.type);
}
