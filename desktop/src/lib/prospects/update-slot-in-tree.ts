import { CardFooterSlot } from "@/lib/prospects/slot-types/card-footer-slot";
import { CardHeaderSlot } from "@/lib/prospects/slot-types/card-header-slot";
import { Slot } from "@/lib/prospects/slot-types/slot";

export function updateSlotInTree<SlotType extends Slot = Slot>(
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

        const updated: Slot | null = updateSlotInTree(current, id, updateFn);
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
        const updatedHeader = updateSlotInTree(root.header, id, updateFn);
        if (updatedHeader) {
          root.header = { ...updatedHeader } as CardHeaderSlot;
          return root;
        }

        const updatedContent = updateSlotInTree(root.content, id, updateFn);
        if (updatedContent) {
          root.content = { ...updatedContent };
          return root;
        }

        const updatedFooter = updateSlotInTree(root.footer, id, updateFn);
        if (updatedFooter) {
          root.footer = { ...updatedFooter } as CardFooterSlot;
          return root;
        }
      }
      return null;

    case "card-footer":
      for (let i = 0; i < root.buttons.length; i++) {
        current = root.buttons[i];
        const updated: Slot | null = updateSlotInTree(current, id, updateFn);
        if (updated) return root;
      }
      return null;

    default:
      return null;
  }
}
