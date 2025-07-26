import { Slot } from "./slot";
import { SlotFlexWrapper } from "./slot-flex-wrapper";
import { Align } from "@/lib/prospect-template/align";

export type ColumnSlot = {
  id: string;
  type: "column";
  content: SlotFlexWrapper[] | Slot[];
  verticalAlign?: Align;
  horizontalAlign?: Align;
};
