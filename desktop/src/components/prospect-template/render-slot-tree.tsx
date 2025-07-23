import { slotEditContext } from "@/contexts/slot-edit-context";
import { BaseSlot } from "@/lib/prospect-template/base-slot";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import { useState } from "react";
import RenderSlot from "./render-slot";
import SlotEditorDialog from "./slot-editor-dialog";

export default function RenderSlotTree({
  slot,
  editMode,
}: RenderSlotProps & { editMode?: boolean }) {
  const [hoverStack, setHoverStack] = useState<BaseSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<BaseSlot | null>(null);

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
        selectedSlot,
        selectSlot: setSelectedSlot,
      }}
    >
      <RenderSlot slot={slot} />

      {editMode && <SlotEditorDialog />}
    </slotEditContext.Provider>
  );
}
