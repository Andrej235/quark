import { Slot } from "../generalized-slots/slot";
import { SlotFlexWrapper } from "../slots-utility/slot-flex-wrapper";
import { Align } from "@/lib/prospects/types/slots-utility/align";

export type ColumnSlot = {
  id: string;
  type: "column";
  content: (Slot | SlotFlexWrapper)[];
  verticalAlign?: Align;
  horizontalAlign?: Align;
};
