import { Slot } from "./slot-types/slot";

//TODO: Change this to check if parent is a layout slot or has some kind of content which is an array
export function canDuplicateSlot(slot: Slot): boolean {
  return slot.type !== "card-header" && slot.type !== "card-footer";
}
