import { getSlotChildren } from "./get-slot-children";
import { Slot } from "./slot-types/slot";

type ProspectDataType = "text" | "image";

export function slotToProspectDataType(slot: Slot): {
  [slotId: string]: ProspectDataType;
} {
  const data = slotToDataTypeShallow(slot);

  return {
    ...data,
    ...getSlotChildren(slot)
      .map((x) => ("slot" in x ? slotToProspectDataType(x.slot) : slotToProspectDataType(x)))
      .reduce((a, b) => ({ ...a, ...b }), {}),
  };
}

function slotToDataTypeShallow(slot: Slot): Record<string, ProspectDataType> | null {
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
    [slot.id]: type,
  };
}
