import { Slot } from "./slot";
import { SlotFlexWrapper } from "./slot-flex-wrapper";

export type ColumnSlot = {
  type: "column";
  content: SlotFlexWrapper[] | Slot[];
};
