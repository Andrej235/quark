import { useSlotHoverStack } from "@/contexts/slot-edit-context";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function SlotEditWrapper({
  slot,
  children,
}: RenderSlotProps & { children?: ReactNode }) {
  const { topSlot, addToHoverStack, removeFromHoverStack } =
    useSlotHoverStack();

  return (
    <div
      className={cn(
        "outline-border/0 rounded-md outline-dashed outline-2 outline-offset-8 transition-colors",
        topSlot === slot && "outline-border",
      )}
      onPointerEnter={() => {
        addToHoverStack(slot);
      }}
      onPointerLeave={() => {
        removeFromHoverStack(slot);
      }}
    >
      {children}
    </div>
  );
}
