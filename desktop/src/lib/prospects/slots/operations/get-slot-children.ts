import { Slot } from "../../types/generalized-slots/slot";
import { SlotFlexWrapper } from "../../types/slots-utility/slot-flex-wrapper";

export function getSlotChildren(slot: Slot): (Slot | SlotFlexWrapper)[] {
  switch (slot.type) {
    case "row":
    case "column":
      return slot.content;

    case "card": {
      const children = [];
      if (slot.header) children.push(slot.header);
      if (slot.content) children.push(slot.content);
      if (slot.footer) children.push(slot.footer);
      return children;
    }

    case "card-footer":
      return slot.buttons;

    default:
      return [];
  }
}
