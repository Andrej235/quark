import { BaseSlot } from "./base-slot";
import { Slot } from "./slot";

export type SlotEditorProps<SlotType extends BaseSlot = Slot> = {
  slot: SlotType;
  setLocalSlot: (slot: SlotType) => void;
};
