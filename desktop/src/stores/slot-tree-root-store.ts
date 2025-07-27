import { findSlotInTree } from "@/lib/prospects/find-slot-in-tree";
import { getAllSlotIdsInTree } from "@/lib/prospects/get-all-slot-ids-in-tree";
import { Slot } from "@/lib/prospects/slot-types/slot";
import { updateSlotInTree } from "@/lib/prospects/update-slot-in-tree";
import { create } from "zustand";

type SlotTreeRootStore = {
  slotTreeRoot: Slot | null;
  slotIds: string[];
  setSlotTreeRoot: (slot: Slot | null) => void;
  updateSlot: <SlotType extends Slot = Slot>(
    id: string,
    updateFn: (slot: SlotType) => void,
  ) => void;
  findSlot: <SlotType extends Slot>(
    predicate: (slot: Slot) => boolean,
  ) => SlotType | null;
  setSlotIds: (slotIds: string[]) => void;
};

export const useSlotTreeRootStore = create<SlotTreeRootStore>((set, get) => ({
  slotTreeRoot: null,
  slotIds: [],
  setSlotTreeRoot: (slot: Slot | null) =>
    set({ slotTreeRoot: slot, slotIds: slot ? getAllSlotIdsInTree(slot) : [] }),
  updateSlot: <SlotType extends Slot = Slot>(
    id: string,
    updateFn: (slot: SlotType) => void,
  ) => {
    const { slotTreeRoot } = get();
    if (!slotTreeRoot) return;

    const updated = updateSlotInTree(slotTreeRoot, id, updateFn);
    if (updated) get().setSlotTreeRoot({ ...updated });
  },
  findSlot: (predicate: (slot: Slot) => boolean) => {
    return findSlotInTree(get().slotTreeRoot, predicate);
  },
  setSlotIds: (slotIds: string[]) => set({ slotIds }),
}));
