import { Slot, SlotType } from "../generalized-slots/slot";

export type RenderSlotProps<TSlotType extends SlotType = SlotType> = {
  slot: Slot<TSlotType>;
};
