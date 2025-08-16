import { useIsSlotInEditMode } from "@/contexts/slot-tree-context";
import { RenderSlotProps } from "@/lib/prospects/types/slots-utility/render-slot-props";
import type { ButtonSlot as ButtonSlotType } from "@/lib/prospects/types/slots/button-slot";
import { Button } from "../../ui/button";

export default function ButtonSlot({ slot }: RenderSlotProps<ButtonSlotType>) {
  const isEditing = useIsSlotInEditMode();

  return (
    <Button disabled={isEditing} variant={slot.variant} size={slot.size}>
      {slot.label}
    </Button>
  );
}
