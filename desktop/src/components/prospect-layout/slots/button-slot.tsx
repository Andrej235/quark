import { useIsSlotInEditMode } from "@/contexts/slot-tree-context";
import { RenderSlotProps } from "@/lib/prospects/types/slots-utility/render-slot-props";
import { Button } from "../../ui/button";

export default function ButtonSlot({ slot }: RenderSlotProps<"button">) {
  const isEditing = useIsSlotInEditMode();

  return (
    <Button disabled={isEditing} variant={slot.variant} size={slot.size}>
      {slot.label}
    </Button>
  );
}
