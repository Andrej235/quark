import { useIsSlotInEditMode } from "@/contexts/slot-edit-context";
import { ButtonSlot as ButtonSlotType } from "@/lib/prospects/slot-types/button-slot";
import { RenderSlotProps } from "@/lib/prospects/slot-types/render-slot-props";
import { Button } from "../ui/button";

export default function ButtonSlot({ slot }: RenderSlotProps<ButtonSlotType>) {
  const isEditing = useIsSlotInEditMode();

  return (
    <Button disabled={isEditing} variant={slot.variant} size={slot.size}>
      {slot.label}
    </Button>
  );
}
