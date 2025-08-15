import { slotEditContext } from "@/contexts/slot-edit-context";
import { useShortcut } from "@/hooks/use-shortcut";
import { cn } from "@/lib/cn";
import { RenderSlotProps } from "@/lib/prospects/types/slots-utility/render-slot-props";
import { useSlotEditorStore } from "@/stores/slot-editor-store";
import { useSlotLayoutModeStore } from "@/stores/slot-layout-edit-store";
import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import { useEffect } from "react";
import RenderSlot from "./render-slot";
import SlotEditorDialog from "./slot-editor-dialog";
import SlotSelectorDialog from "./slot-selector-dialog";

export default function RenderSlotTree({
  slot,
  editMode,
}: RenderSlotProps & { editMode?: boolean }) {
  const root = useSlotTreeRootStore((x) => x.slotTreeRoot);
  const setRoot = useSlotTreeRootStore((x) => x.setSlotTreeRoot);
  useEffect(() => {
    setRoot(slot);
  }, [slot, setRoot]);

  const isInLayoutMode = useSlotLayoutModeStore((x) => x.layoutRootId) !== null;
  const exitLayoutMode = useSlotLayoutModeStore((x) => x.exitLayoutMode);

  const isInEditMode = useSlotEditorStore((x) => x.editingSlot) !== null;
  const exitEditMode = useSlotEditorStore((x) => x.exit);

  useShortcut({
    key: "Escape",
    callback: () => {
      exitLayoutMode();
      exitEditMode();
    },
    preventDefault: true,
    stopPropagation: true,
    enabled: isInLayoutMode || isInEditMode,
  });

  if (!root) return null;

  return (
    <div className={cn((isInLayoutMode || isInEditMode) && "select-none")}>
      <slotEditContext.Provider
        value={{
          isEditModeActive: editMode ?? false,
        }}
      >
        <RenderSlot slot={root} />

        <SlotEditorDialog />
        <SlotSelectorDialog />
      </slotEditContext.Provider>
    </div>
  );
}
