import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import { useState } from "react";
import { Separator } from "./ui/separator";
import { motion, useDragControls } from "motion/react";

export default function LayoutAlignmentMenu() {
  const horizontalModes = ["start", "center", "end"] as const;
  const verticalModes = ["start", "center", "end"] as const;

  const [selectedMode, setSelectedMode] = useState<
    [(typeof horizontalModes)[number], (typeof verticalModes)[number]]
  >(["center", "center"]);

  const dragControls = useDragControls();

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
        {horizontalModes.flatMap((x) =>
          verticalModes.map((y) => (
            <ModeButton
              key={x + y}
              active={x === selectedMode[0] && y === selectedMode[1]}
              setActive={() => setSelectedMode([x, y])}
            />
          )),
        )}
      </div>
    </motion.div>
  );
}

type ModeButtonProps = {
  active: boolean;
  setActive: () => void;
};

function ModeButton({ active, setActive }: ModeButtonProps) {
  return (
    <button
      className={cn(
        "bg-muted-foreground/40 rounded-xs hover:bg-muted-foreground size-full transition-colors",
        active && "bg-muted-foreground/80",
      )}
      onClick={setActive}
    />
  );
}
