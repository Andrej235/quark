import { getSlotChildren } from "./get-slot-children";
import { Slot } from "./slot-types/slot";

export function isSlotParent(slot: Slot, child: Slot): boolean {
  return !!getSlotChildren(slot).find(
    (x) => ("slot" in x ? x.slot : x).id === child.id,
  );
}
