import { Slot } from "./slot";
import { SlotFlexWrapper } from "./slot-flex-wrapper";

export type RowSlot = {
  id: string;
  type: "row";
  content: SlotFlexWrapper[] | Slot[];
};
