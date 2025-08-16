import { DeserializeRegex } from "@/lib/format/serialize-regex";
import { SlotData } from "../../types/data/slot-data";
import { Slot } from "../../types/generalized-slots/slot";
import { isInputSlot } from "../type-checks/is-input-slot";

export function validateSlotData(slot: Slot, data: SlotData): boolean;
export function validateSlotData(
  slots: [slot: Slot, data: SlotData][],
): boolean;

export function validateSlotData(
  slot: Slot | [slot: Slot, data: SlotData][],
  data?: SlotData,
) {
  if (Array.isArray(slot))
    return !slot.reduce((acc, cur) => !acc || validateSingle(...cur), false);

  if (data) return validateSingle(slot, data);

  return false;
}

function validateSingle(slot: Slot, data: SlotData): boolean {
  // Mismatched data
  if (slot.id !== data.id) return false;

  // Slot is not even supposed to have data
  if (!isInputSlot(slot)) return false;

  if (slot.type === "image-field") return true;

  if (slot.type === "text-field") {
    if (slot.required && !data.value) return false;

    if (
      slot.validateFormat !== "none" &&
      !DeserializeRegex(slot.formatRegex).test(data.value ?? "")
    )
      return false;

    return true;
  }

  // Slot is not registered as an input slot
  return false;
}
