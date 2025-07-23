import { useEffect, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Slot } from "@/lib/prospect-template/slot";

function useSelectedSlot(): [Slot | null, (selectedSlot: Slot | null) => void] {
  return [null, () => {}];
}

export default function SlotEditorDialog() {
  const [selectedSlot, setSelectedSlot] = useSelectedSlot();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null!);

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

  useOnClickOutside(containerRef, () => {
    if (isOpen) setSelectedSlot(null);
  });

  if (!selectedSlot) return null;

  return (
    <Card
      ref={containerRef}
      className="w-xl fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <CardHeader>
        <CardTitle>Edit Slot&apos;s Data</CardTitle>
        <CardDescription>{selectedSlot.type}</CardDescription>
      </CardHeader>
    </Card>
  );
}
