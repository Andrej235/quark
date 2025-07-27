import { Align } from "./align";
import { Slot } from "./slot";
import { SlotFlexWrapper } from "./slot-flex-wrapper";

export type RowSlot = {
  id: string;
  type: "row";
  content: (Slot | SlotFlexWrapper)[];
  verticalAlign?: Align;
  horizontalAlign?: Align;
};
