import { getSlotChildren } from "@/lib/prospects/get-slot-children";
import { Slot } from "@/lib/prospects/slot-types/slot";

export function getAllSlotIdsInTree(slot: Slot): string[] {
  return [
    slot.id,
    ...getSlotChildren(slot).flatMap((x) =>
      getAllSlotIdsInTree("slot" in x ? x.slot : x),
    ),
  ];
}
