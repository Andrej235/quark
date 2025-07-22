import { Slot } from "./slot";
import { SlotFlexWrapper } from "./slot-flex-wrapper";

export type RowSlot = {
  type: "row";
  content: SlotFlexWrapper[] | Slot[];
};
