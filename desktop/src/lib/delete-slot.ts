import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import { isSlotParent } from "./prospects/is-slot-parent";
import { Slot } from "./prospects/slot-types/slot";
import { RowSlot } from "./prospects/slot-types/row-slot";
import { ColumnSlot } from "./prospects/slot-types/column-slot";
import { CardSlot } from "./prospects/slot-types/card-slot";
import { CardFooterSlot } from "./prospects/slot-types/card-footer-slot";

export function deleteSlot(slot: Slot) {
  const storeState = useSlotTreeRootStore.getState();
  const parentSlot = storeState.findSlot((x) => isSlotParent(x, slot));
  if (!parentSlot) return;

  switch (parentSlot.type) {
    case "row":
    case "column":
      storeState.updateSlot<RowSlot | ColumnSlot>(parentSlot.id, (x) => {
        x.content = x.content.filter(
          (x) => ("slot" in x ? x.slot : x) !== slot,
        );
      });
      break;

    case "card":
      if (parentSlot.header === slot)
        storeState.updateSlot<CardSlot>(parentSlot.id, (x) => {
          x.header = null;
        });

      if (parentSlot.content === slot)
        storeState.updateSlot<CardSlot>(parentSlot.id, (x) => {
          x.content = null;
        });

      if (parentSlot.footer === slot)
        storeState.updateSlot<CardSlot>(parentSlot.id, (x) => {
          x.footer = null;
        });
      break;

    case "card-footer":
      storeState.updateSlot<CardFooterSlot>(parentSlot.id, (x) => {
        x.buttons = x.buttons.filter((x) => x !== slot);
      });
      break;

    default:
      break;
  }
}
