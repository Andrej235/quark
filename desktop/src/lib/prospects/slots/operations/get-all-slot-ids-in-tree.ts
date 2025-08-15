import { getSlotChildren } from "@/lib/prospects/slots/operations/get-slot-children";
import { Slot } from "@/lib/prospects/types/generalized-slots/slot";

export function getAllSlotIdsInTree(slot: Slot): string[] {
  return [
    slot.id,
    ...getSlotChildren(slot).flatMap((x) =>
      getAllSlotIdsInTree("slot" in x ? x.slot : x),
    ),
  ];
}
