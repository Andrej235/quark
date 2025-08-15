import { Slot } from "../generalized-slots/slot";

export type RenderSlotProps<SlotType extends Slot = Slot> = {
  slot: SlotType;
};
