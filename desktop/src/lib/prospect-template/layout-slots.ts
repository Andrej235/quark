import { BaseSlot } from "./base-slot";
import { Slot } from "./slot";
import { SlotFlexWrapper } from "./slot-flex-wrapper";

type IsLayoutSlot<T extends BaseSlot> = T extends {
  content: BaseSlot[] | SlotFlexWrapper[];
}
  ? T
  : never;

export type LayoutSlots = Extract<Slot, IsLayoutSlot<Slot>>;
