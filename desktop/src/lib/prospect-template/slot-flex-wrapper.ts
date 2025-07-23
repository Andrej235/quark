import { BaseSlot } from "./base-slot";
import { Slot } from "./slot";

export type SlotFlexWrapper<T extends BaseSlot = Slot> = {
  flex: number;
  slot: T;
};
