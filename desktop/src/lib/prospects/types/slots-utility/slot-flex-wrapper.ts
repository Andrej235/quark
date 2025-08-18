import { Slot } from "../generalized-slots/slot";

export type SlotFlexWrapper<T extends Slot = Slot> = {
  flex: number;
  slot: T;
};
