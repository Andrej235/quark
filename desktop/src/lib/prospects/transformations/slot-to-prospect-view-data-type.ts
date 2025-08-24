import { getSlotChildren } from "../slots/operations/get-slot-children";
import {
  ProspectDataType,
  ProspectFieldDefinition,
} from "../types/data/prospect-data-definition";
import { Slot } from "../types/generalized-slots/slot";

export function slotToProspectViewDataType(
  slot: Slot,
): ProspectFieldDefinition[] {
  return [
    slotToDataTypeShallow(slot),
    ...getSlotChildren(slot).flatMap((x) =>
      "slot" in x
        ? slotToProspectViewDataType(x.slot)
        : slotToProspectViewDataType(x),
    ),
  ].filter((x) => !!x);
}

function slotToDataTypeShallow(slot: Slot): ProspectFieldDefinition | null {
  function getType(): ProspectDataType | null {
    switch (slot.type) {
      case "text-field":
        return "text";
      case "dropdown":
        return "dropdown";
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
