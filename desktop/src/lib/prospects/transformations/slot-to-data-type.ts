import { ProspectDataType } from "../types/data/prospect-data-definition";
import { InputSlot } from "../types/generalized-slots/input-slot";

export function slotToDataType(slot: InputSlot): ProspectDataType | null {
  switch (slot.type) {
    case "text-field":
      return "text";
    case "rich-text-field":
      return "text";
    case "image-field":
      return "image";
    case "dropdown":
      return "dropdown";
    default:
      return null;
  }
}
