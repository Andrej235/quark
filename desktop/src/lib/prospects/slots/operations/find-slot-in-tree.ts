import { getSlotChildren } from "@/lib/prospects/slots/operations/get-slot-children";
import { Slot } from "@/lib/prospects/types/generalized-slots/slot";

export function findSlotInTree<SlotType extends Slot>(
  root: Slot | null | undefined,
  predicate: (slot: Slot) => boolean,
): SlotType | null {
  if (!root) return null;
  if (predicate(root)) return root as SlotType;

  for (const child of getSlotChildren(root)) {
    const slot = "slot" in child ? child.slot : child;
    const found = findSlotInTree(slot, predicate);
    if (found) return found as SlotType;
  }

  return null;
}
