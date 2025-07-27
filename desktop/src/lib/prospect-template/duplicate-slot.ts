import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import { isSlotParent } from "./is-slot-parent";
import { Slot } from "./slot";
import { cloneSlot } from "./clone-slot";
import { SlotFlexWrapper } from "./slot-flex-wrapper";
import { RowSlot } from "./row-slot";
import { ColumnSlot } from "./column-slot";

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
