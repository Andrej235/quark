import { Slot } from "./slot";
import { SlotFlexWrapper } from "./slot-flex-wrapper";

export type RowSlot = {
  id: string;
  type: "row";
  content: SlotFlexWrapper[] | Slot[];
  verticalAlign?: "flex-start" | "center" | "flex-end";
  horizontalAlign?: "flex-start" | "center" | "flex-end";
};
