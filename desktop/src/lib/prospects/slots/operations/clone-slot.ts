import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import { Slot } from "../../types/generalized-slots/slot";

export function cloneSlot<T extends Slot>(slot: T): T {
  const newSlot = { ...slot };
  newSlot.id = getNewId(slot.id);

  switch (newSlot.type) {
    case "row":
    case "column":
      newSlot.content = newSlot.content.map((x) =>
        "slot" in x ? { ...x, slot: cloneSlot(x.slot) } : cloneSlot(x),
      );
      break;

    case "card":
      newSlot.header = newSlot.header && cloneSlot(newSlot.header);
      newSlot.content = newSlot.content && cloneSlot(newSlot.content);
      newSlot.footer = newSlot.footer && cloneSlot(newSlot.footer);
      break;

    case "card-footer":
      newSlot.buttons = newSlot.buttons.map(cloneSlot);
      break;

    default:
      break;
  }

  return newSlot;
}

function getNewId(id: string): string {
  const storeState = useSlotTreeRootStore.getState();

  // Extract base id (remove existing numeric suffix if present)
  const baseIdMatch = id.match(/^(.*?)(-\d+)?$/);
  const baseId = baseIdMatch ? baseIdMatch[1] : id;

  // Find all slot ids that start with baseId + "-"
  const slotIds = storeState.slotIds.filter((x) => x.startsWith(baseId + "-"));

  // Extract numeric suffixes
  const suffixNumbers = slotIds
    .map((x) => {
      const match = x.match(new RegExp(`^${baseId}-(\\d+)$`));
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => n > 0);

  // Find max suffix and increment
  const maxSuffix = suffixNumbers.length ? Math.max(...suffixNumbers) : 0;
  const newId = `${baseId}-${maxSuffix + 1}`;
  storeState.setSlotIds([...storeState.slotIds, newId]);
  return newId;
}
