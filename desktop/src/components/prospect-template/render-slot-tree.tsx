import { slotEditContext } from "@/contexts/slot-edit-context";
import { useShortcut } from "@/hooks/use-shortcut";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import { cn } from "@/lib/utils";
import { useSlotLayoutModeStore } from "@/stores/slot-layout-edit-store";
import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import { useEffect } from "react";
import RenderSlot from "./render-slot";
import SlotEditorDialog from "./slot-editor-dialog";

export default function RenderSlotTree({
  slot,
  editMode,
}: RenderSlotProps & { editMode?: boolean }) {
  const root = useSlotTreeRootStore((x) => x.slotTreeRoot);
  const setRoot = useSlotTreeRootStore((x) => x.setSlotTreeRoot);
  useEffect(() => {
    setRoot(slot);
  }, [slot, setRoot]);

  const layoutRoot = useSlotLayoutModeStore((x) => x.layoutRoot);
  const isInLayoutMode = layoutRoot !== null;
  const exitLayoutMode = useSlotLayoutModeStore((x) => x.exitLayoutMode);

  useShortcut({
    key: "Escape",
    callback: exitLayoutMode,
    preventDefault: true,
    stopPropagation: true,
    enabled: isInLayoutMode,
  });

  if (!root) return null;

  return (
    <div className={cn(isInLayoutMode && "select-none")}>
      <slotEditContext.Provider
        value={{
          isEditModeActive: editMode ?? false,
        }}
      >
        <RenderSlot slot={root} />

        {editMode && <SlotEditorDialog />}
      </slotEditContext.Provider>
    </div>
  );
}
