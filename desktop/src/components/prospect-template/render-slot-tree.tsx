import { slotEditContext } from "@/contexts/slot-edit-context";
import { useShortcut } from "@/hooks/use-shortcut";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import { useSlotLayoutModeStore } from "@/stores/slot-layout-edit-store";
import { useState } from "react";
import RenderSlot from "./render-slot";
import SlotEditorDialog from "./slot-editor-dialog";

export default function RenderSlotTree({
  slot,
  editMode,
}: RenderSlotProps & { editMode?: boolean }) {
  const [rootSlot] = useState(slot);
  const isInLayoutMode = useSlotLayoutModeStore((x) => x.layoutRoot) !== null;
  const exitLayoutMode = useSlotLayoutModeStore((x) => x.exitLayoutMode);

  useShortcut({
    key: "x",
    callback: exitLayoutMode,
    preventDefault: true,
    stopPropagation: true,
    enabled: isInLayoutMode,
  });

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
