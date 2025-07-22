import { useIsSlotInEditMode } from "@/contexts/slot-edit-context";
import { ButtonSlot as ButtonSlotType } from "@/lib/prospect-template/button-slot";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import { Button } from "../ui/button";

export default function ButtonSlot({ slot }: RenderSlotProps<ButtonSlotType>) {
  const isEditing = useIsSlotInEditMode();

  return <Button disabled={isEditing}>{slot.label}</Button>;
}
