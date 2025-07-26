import { CardFooterSlot } from "@/lib/prospect-template/card-footer-slot";
import { CardHeaderSlot } from "@/lib/prospect-template/card-header-slot";
import { Slot } from "@/lib/prospect-template/slot";
import { SlotFlexWrapper } from "@/lib/prospect-template/slot-flex-wrapper";
import { create } from "zustand";

type SlotTreeRootStore = {
  slotTreeRoot: Slot | null;
  setSlotTreeRoot: (slot: Slot | null) => void;
  updateSlot: <SlotType extends Slot = Slot>(
    id: string,
    updateFn: (slot: SlotType) => void,
  ) => void;
  findSlot: <SlotType extends Slot>(
    predicate: (slot: Slot) => boolean,
  ) => SlotType | null;
};

export const useSlotTreeRootStore = create<SlotTreeRootStore>((set, get) => ({
  slotTreeRoot: null,
  setSlotTreeRoot: (slot: Slot | null) => set({ slotTreeRoot: slot }),
  updateSlot: <SlotType extends Slot = Slot>(
    id: string,
    updateFn: (slot: SlotType) => void,
  ) => {
    const { slotTreeRoot } = get();
    if (!slotTreeRoot) return;

    const updated = updateSlot(slotTreeRoot, id, updateFn);
    if (updated) set({ slotTreeRoot: { ...updated } });
  },
  findSlot: (predicate: (slot: Slot) => boolean) => {
    return findSlot(get().slotTreeRoot, predicate);
  },
}));

function updateSlot<SlotType extends Slot = Slot>(
  root: Slot | null | undefined,
  id: string,
  updateFn: (slot: SlotType) => void,
): Slot | null {
  if (!root) return null;
  if (root.id === id) {
    updateFn(root as unknown as SlotType);
    return root as unknown as SlotType;
  }

  let current: Slot | null = null;
  switch (root.type) {
    case "row":
    case "column":
      for (let i = 0; i < root.content.length; i++) {
        const child = root.content[i];
        current = "slot" in child ? child.slot : child;

        const updated: Slot | null = updateSlot(current, id, updateFn);
        if (updated) {
          root.content[i] =
            "slot" in child
              ? {
                  ...child,
                  slot: { ...updated },
                }
              : { ...updated };
          return root;
        }
      }
      return null;

    case "card":
      {
        const updatedHeader = updateSlot(root.header, id, updateFn);
        if (updatedHeader) {
          root.header = { ...updatedHeader } as CardHeaderSlot;
          return root;
        }

        const updatedContent = updateSlot(root.content, id, updateFn);
        if (updatedContent) {
          root.content = { ...updatedContent };
          return root;
        }

        const updatedFooter = updateSlot(root.footer, id, updateFn);
        if (updatedFooter) {
          root.footer = { ...updatedFooter } as CardFooterSlot;
          return root;
        }
      }
      return null;

    case "card-footer":
      for (let i = 0; i < root.buttons.length; i++) {
        current = root.buttons[i];
        const updated: Slot | null = updateSlot(current, id, updateFn);
        if (updated) return root;
      }
      return null;

    default:
      return null;
  }
}

function findSlot<SlotType extends Slot>(
  root: Slot | null | undefined,
  predicate: (slot: Slot) => boolean,
): SlotType | null {
  if (!root) return null;
  if (predicate(root)) return root as SlotType;

  switch (root.type) {
    case "row":
    case "column":
      for (let i = 0; i < root.content.length; i++) {
        const hasFlexData = "slot" in root.content[i];
        const current = hasFlexData
          ? (root.content[i] as SlotFlexWrapper).slot
          : (root.content[i] as Slot);

        const found = findSlot(current, predicate);
        if (found) return found as SlotType;
      }
      return null;

    case "card": {
      const foundHeader = findSlot(root.header, predicate);
      if (foundHeader) return foundHeader as SlotType;

      const foundContent = findSlot(root.content, predicate);
      if (foundContent) return foundContent as SlotType;

      const foundFooter = findSlot(root.footer, predicate);
      if (foundFooter) return foundFooter as SlotType;
      return null;
    }

    case "card-footer":
      for (let i = 0; i < root.buttons.length; i++) {
        const found = findSlot(root.buttons[i], predicate);
        if (found) return found as SlotType;
      }
      return null;

    default:
      return null;
  }
}
