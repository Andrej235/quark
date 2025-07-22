import { slotEditContext } from "@/contexts/slot-edit-context";
import { BaseSlot } from "@/lib/prospect-template/base-slot";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import { useState } from "react";
import RenderSlot from "./render-slot";

export default function RenderSlotTree({
  slot,
  editMode,
}: RenderSlotProps & { editMode?: boolean }) {
  const [hoverStack, setHoverStack] = useState<BaseSlot[]>([]);

  return (
    <slotEditContext.Provider
      value={{
        isEditModeActive: editMode ?? false,
        topSlot: hoverStack[hoverStack.length - 1] ?? null,
        addToHoverStack: (slot: BaseSlot) => {
          setHoverStack((prev) => [...prev, slot]);
        },
        removeFromHoverStack: (slot: BaseSlot) => {
          setHoverStack((prev) => prev.filter((s) => s !== slot));
        },
      }}
    >
      <RenderSlot slot={slot} />
    </slotEditContext.Provider>
  );
}
