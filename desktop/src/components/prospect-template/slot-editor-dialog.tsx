import { useSlotEditorStore } from "@/stores/slot-editor-store";
import { motion, useDragControls } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { GripVertical } from "lucide-react";

export default function SlotEditorDialog() {
  const selectedSlot = useSlotEditorStore((x) => x.editingSlot);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null!);
  const dragControls = useDragControls();

  const mousePosition = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEventListener("mousemove", (event) => {
    mousePosition.current = {
      x: event.clientX,
      y: event.clientY,
    };
  });

  useEffect(() => {
    setIsOpen(!!selectedSlot);

    if (!selectedSlot || !containerRef.current) return;

    const offset = 25;
    const x =
      mousePosition.current.x + containerRef.current.offsetWidth / 2 + offset;
    const y = mousePosition.current.y;

    containerRef.current.style.left = `${x}px`;
    containerRef.current.style.top = `${y}px`;
  }, [selectedSlot]);

  if (!selectedSlot) return null;

  return (
    <motion.div
      ref={containerRef}
      className="-translate-1/2 fixed left-1/2 top-1/2"
      initial={{
        scale: 0.5,
        opacity: 0,
      }}
      animate={{
        scale: isOpen ? 1 : 0.5,
        opacity: isOpen ? 1 : 0,
      }}
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
    >
      <Card className="w-xl">
        <CardHeader
          onPointerDown={(e) => dragControls.start(e)}
          className="select-none"
        >
          <CardTitle className="flex justify-between">
            <span>Edit Slot&apos;s Data</span>

            <GripVertical className="text-muted-foreground size-5" />
          </CardTitle>

          <CardDescription>{selectedSlot.type}</CardDescription>
        </CardHeader>

        <CardAction></CardAction>
      </Card>
    </motion.div>
  );
}
