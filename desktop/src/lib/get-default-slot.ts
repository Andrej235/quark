import { defaultSlots } from "./default-slots";
import { Slot } from "./prospects/slot-types/slot";
import { SlotType } from "./prospects/slot-types/slot-type";

export function getDefaultSlot<T extends SlotType>(type: T): Slot<T> {
  return defaultSlots[type];
}
