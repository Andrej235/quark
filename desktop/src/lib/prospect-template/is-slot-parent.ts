import { ButtonSlot } from "./button-slot";
import { Slot } from "./slot";

export function isSlotParent(slot: Slot, child: Slot): boolean {
  if (slot.type === "row" || slot.type === "column")
    return (
      slot.content.includes(child) ||
      slot.content.some((x) => "slot" in x && x.slot === child)
    );

  if (slot.type === "card")
    return (
      slot.header === child || slot.content === child || slot.footer === child
    );

  if (slot.type === "card-footer")
    return slot.buttons.includes(child as ButtonSlot);

  return false;
}
