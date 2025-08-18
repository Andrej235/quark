import { Align } from "../slots-utility/align";
import { Slot } from "../generalized-slots/slot";
import { SlotFlexWrapper } from "../slots-utility/slot-flex-wrapper";

export type RowSlot = {
  id: string;
  type: "row";
  content: (Slot | SlotFlexWrapper)[];
  verticalAlign?: Align;
  horizontalAlign?: Align;
};
