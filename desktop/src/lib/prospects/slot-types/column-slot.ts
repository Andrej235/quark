import { Slot } from "./slot";
import { SlotFlexWrapper } from "./slot-flex-wrapper";
import { Align } from "@/lib/prospects/slot-types/align";

export type ColumnSlot = {
  id: string;
  type: "column";
  content: (Slot | SlotFlexWrapper)[];
  verticalAlign?: Align;
  horizontalAlign?: Align;
};
