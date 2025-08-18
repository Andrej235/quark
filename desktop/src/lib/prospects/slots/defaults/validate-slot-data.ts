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
  if (Array.isArray(slot)) {
    for (const [$slot, $data] of slot) {
      if (!validateSingle($slot, $data)) {
        return false;
      }
    }

    return true;
  }

  if (data) return validateSingle(slot, data);

  return false;
}

function validateSingle(slot: Slot, data: SlotData): boolean {
  // Mismatched data
  if (slot.id !== data.id) return false;

  // Slot is not even supposed to have data
  if (!isInputSlot(slot)) return false;

  if (slot.type === "image-field") {
    if (!data.value) return !slot.required;

    return true;
  }

  if (slot.type === "text-field") {
    // If the data is missing and slot is not required return true to skip over regex validation
    if (!data.value) return !slot.required;

    if (
      slot.validateFormat !== "none" &&
      !DeserializeRegex(slot.formatRegex).test(data.value ?? "")
    )
      return false;

    return true;
  }

  if (slot.type === "dropdown") {
    // If the data is missing and slot is not required return true to skip over options validation
    if (!data.value) return !slot.required;

    // Validate that the value is one of the options
    if (!slot.options.some((x) => x.value === data.value)) return false;

    return true;
  }

  // Slot is not registered as an input slot
  return false;
}
