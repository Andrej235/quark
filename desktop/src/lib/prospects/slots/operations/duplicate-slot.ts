import { cloneSlot } from "@/lib/prospects/slots/operations/clone-slot";
import { isSlotParent } from "@/lib/prospects/slots/operations/is-slot-parent";
import { Slot } from "@/lib/prospects/types/generalized-slots/slot";
import { SlotFlexWrapper } from "@/lib/prospects/types/slots-utility/slot-flex-wrapper";
import { ColumnSlot } from "@/lib/prospects/types/slots/column-slot";
import { RowSlot } from "@/lib/prospects/types/slots/row-slot";
import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";

export function duplicateSlot(slot: Slot) {
  const storeState = useSlotTreeRootStore.getState();

  const parent = storeState.findSlot((x) => isSlotParent(x, slot));
  if (parent?.type !== "column" && parent?.type !== "row") return;

  const isFlex = !parent.content.includes(slot);
  const newSlot = isFlex
    ? {
        flex: (
          parent.content.find(
            (x) => "slot" in x && x.slot === slot,
          ) as SlotFlexWrapper
        ).flex,
        slot: cloneSlot(slot),
      }
    : cloneSlot(slot);

  storeState.updateSlot<RowSlot | ColumnSlot>(parent.id, (x) =>
    x.content.push(newSlot),
  );
}
