import { Slot, SlotType } from "../generalized-slots/slot";

export type SlotEditorProps<TSlotType extends SlotType = SlotType> = {
  slot: Slot<TSlotType>;
  setLocalSlot: (slot: Slot<TSlotType>) => void;
};
