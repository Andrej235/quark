import { BaseSlot } from "./base-slot";
import { Slot } from "./slot";

export type RenderSlotProps<SlotType extends BaseSlot = Slot> = {
  slot: SlotType;
};
