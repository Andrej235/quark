import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import { isSlotParent } from "./is-slot-parent";
import { Slot } from "./slot-types/slot";
import { cloneSlot } from "./clone-slot";
import { SlotFlexWrapper } from "./slot-types/slot-flex-wrapper";
import { ColumnSlot } from "./slot-types/column-slot";
import { RowSlot } from "./slot-types/row-slot";

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
