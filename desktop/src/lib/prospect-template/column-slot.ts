import { Slot } from "./slot";
import { SlotFlexWrapper } from "./slot-flex-wrapper";

export type ColumnSlot = {
  id: string;
  type: "column";
  content: SlotFlexWrapper[] | Slot[];
  verticalAlign?: "flex-start" | "center" | "flex-end";
  horizontalAlign?: "flex-start" | "center" | "flex-end";
};
