import { defaultSlots } from "./default-slots";
import { Slot, SlotType } from "../../types/generalized-slots/slot";

export function getDefaultSlot<T extends SlotType>(type: T): Slot<T> {
  return defaultSlots[type];
}
