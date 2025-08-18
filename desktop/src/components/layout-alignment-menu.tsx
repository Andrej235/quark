import { ColumnSlot } from "@/lib/prospects/types/slots/column-slot";
import { RowSlot } from "@/lib/prospects/types/slots/row-slot";
import { cn } from "@/lib/cn";
import { useSlotLayoutModeStore } from "@/stores/slot-layout-edit-store";
import { useSlotTreeRootStore } from "@/stores/slot-tree-root-store";
import { ChevronsLeftRight, GripVertical } from "lucide-react";
import { motion, useDragControls } from "motion/react";
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { Align } from "@/lib/prospects/types/slots-utility/align";

const horizontalModes = ["flex-start", "center", "flex-end"] as const;
const verticalModes = ["flex-start", "center", "flex-end"] as const;

type LayoutAlignmentMenuProps = {
  initialHorizontalMode: Align;
  initialVerticalMode: Align;
};

export default function LayoutAlignmentMenu({
  initialHorizontalMode,
  initialVerticalMode,
}: LayoutAlignmentMenuProps) {
  const [selectedMode, setSelectedMode] = useState<[Align, Align]>([
    "stretch",
    "stretch",
  ]);

  useEffect(() => {
    setSelectedMode([initialHorizontalMode, initialVerticalMode]);
    console.log(initialHorizontalMode, initialVerticalMode);
  }, [initialHorizontalMode, initialVerticalMode]);

  const dragControls = useDragControls();
  const editingLayoutRoot = useSlotLayoutModeStore((x) => x.layoutRootId);
  const updateSlot = useSlotTreeRootStore((x) => x.updateSlot);

  function handleSelect(x: Align, y: Align) {
    if (!editingLayoutRoot) return;

    updateSlot<RowSlot | ColumnSlot>(editingLayoutRoot, (slot) => {
      slot.horizontalAlign = x;
      slot.verticalAlign = y;
    });
    setSelectedMode([x, y]);
  }

  return (
    <motion.div
      drag
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{
        scale: 0.95,
      }}
      transition={{
        duration: 0.1,
      }}
      dragTransition={{
        velocity: 0,
      }}
      className="bg-card border-border absolute right-0 top-0 z-50 space-y-2 rounded-md border-2 p-2"
    >
      <div
        className="flex cursor-grab select-none items-center justify-between"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <p className="text-muted-foreground text-sm font-semibold">Alignment</p>
        <GripVertical className="text-muted-foreground size-5" />
      </div>

      <Separator />

      <div className="grid size-32 grid-cols-[2fr_5fr_2fr] grid-rows-[2fr_5fr_2fr] gap-2">
        {horizontalModes.flatMap((y) =>
          verticalModes.map((x) => (
            <ModeButton
              key={x + y}
              mode={[x, y]}
              active={[selectedMode[0], selectedMode[1]]}
              setActive={handleSelect}
            />
          )),
        )}
      </div>
    </motion.div>
  );
}

type ModeButtonProps = {
  mode: [Align, Align];
  active: [Align, Align];
  setActive: (x: Align, y: Align) => void;
};

function ModeButton({ active, setActive, mode }: ModeButtonProps) {
  const isActive = mode[0] === active[0] && mode[1] === active[1];
  const isCenter = mode[0] === "center" && mode[1] === "center";
  const isStretch =
    isCenter && active[0] === "stretch" && active[1] === "stretch";

  const [isHoldingAlt, setIsHoldingAlt] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Alt") {
        setIsHoldingAlt(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Alt") {
        setIsHoldingAlt(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  function handleClick() {
    if (!isStretch && isCenter && isHoldingAlt) {
      setActive("stretch", "stretch");
      return;
    }

    if (isStretch && isHoldingAlt) {
      setActive("center", "center");
      return;
    }

    setActive(mode[0], mode[1]);
  }

  return (
    <button
      className={cn(
        "bg-muted-foreground/40 rounded-xs hover:bg-muted-foreground size-full transition-colors",
        (isActive || isStretch) && "bg-muted-foreground/80",
      )}
      onClick={handleClick}
    >
      {((isStretch && !isHoldingAlt) ||
        (isHoldingAlt && isCenter && !isStretch)) && (
        <ChevronsLeftRight className="m-auto size-12" />
      )}
    </button>
  );
}
