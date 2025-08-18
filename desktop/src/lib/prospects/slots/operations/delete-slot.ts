import { isSlotParent } from "@/lib/prospects/slots/operations/is-slot-parent";
import { Slot } from "@/lib/prospects/types/generalized-slots/slot";
import { CardFooterSlot } from "@/lib/prospects/types/slots/card-footer-slot";
import { CardSlot } from "@/lib/prospects/types/slots/card-slot";
import { ColumnSlot } from "@/lib/prospects/types/slots/column-slot";
import { RowSlot } from "@/lib/prospects/types/slots/row-slot";
import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";

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
