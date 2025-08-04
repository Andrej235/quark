import { getSlotChildren } from "./get-slot-children";
import {
  ProspectFieldDefinition,
  ProspectDataType,
} from "./prospect-data-definition";
import { Slot } from "./slot-types/slot";

export function slotToProspectDataType(slot: Slot): ProspectFieldDefinition[] {
  return [
    slotToDataTypeShallow(slot),
    ...getSlotChildren(slot).flatMap((x) =>
      "slot" in x ? slotToProspectDataType(x.slot) : slotToProspectDataType(x),
    ),
  ].filter((x) => !!x);
}

function slotToDataTypeShallow(slot: Slot): ProspectFieldDefinition | null {
  function getType(): ProspectDataType | null {
    switch (slot.type) {
      case "text-field":
        return "text";
      case "image-field":
        return "image";
      default:
        return null;
    }
  }

  const type = getType();
  if (!type) return null;

  return {
    id: slot.id,
    type,
  };
}
