import { slotEditContext } from "@/contexts/slot-edit-context";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import { useState } from "react";
import RenderSlot from "./render-slot";
import SlotEditorDialog from "./slot-editor-dialog";

export default function RenderSlotTree({
  slot,
  editMode,
}: RenderSlotProps & { editMode?: boolean }) {
  const [rootSlot] = useState(slot);

  return (
    <slotEditContext.Provider
      value={{
        isEditModeActive: editMode ?? false,
      }}
    >
      <RenderSlot slot={rootSlot} />

      {editMode && <SlotEditorDialog />}
    </slotEditContext.Provider>
  );
}
