import { Slot } from "../generalized-slots/slot";

export type SlotEditorProps<SlotType extends Slot = Slot> = {
  slot: SlotType;
  setLocalSlot: (slot: SlotType) => void;
};
