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
    case "button":
    case "text-field":
    case "image-field":
    case "card-header":
      return null;

    case "row":
    case "column":
      for (let i = 0; i < root.content.length; i++) {
        const hasFlexData = "slot" in root.content[i];
        current = hasFlexData
          ? (root.content[i] as SlotFlexWrapper).slot
          : (root.content[i] as Slot);

        const updated: Slot | null = updateSlot(current, id, updateFn);
        if (updated) {
          root.content[i] = hasFlexData
            ? ({
                ...root.content[i],
                slot: { ...updated },
              } as SlotFlexWrapper)
            : { ...updated };
          return root;
        }
      }
      return null;

    case "card":
      {
        const updatedHeader = updateSlot(root.header, id, updateFn);
        if (updatedHeader) {
          root.header = updatedHeader as CardHeaderSlot;
          return root;
        }

        const updatedContent = updateSlot(root.content, id, updateFn);
        if (updatedContent) {
          root.content = { ...updatedContent };
          return root;
        }

        const updatedFooter = updateSlot(root.footer, id, updateFn);
        if (updatedFooter) {
          root.footer = updatedFooter as CardFooterSlot;
          return root;
        }
      }
      return null;

    case "card-footer":
      for (let i = 0; i < root.buttons.length; i++) {
        current = root.buttons[i];
        const updated: Slot | null = updateSlot(current, id, updateFn);
        if (updated) return updated;
      }
      return null;

    default:
      return null;
  }
}
