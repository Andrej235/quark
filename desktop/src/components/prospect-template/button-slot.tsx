import { ButtonSlot as ButtonSlotType } from "@/lib/prospect-template/button-slot";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import { Button } from "../ui/button";

export default function ButtonSlot({ slot }: RenderSlotProps<ButtonSlotType>) {
  return <Button disabled={slot.disabled}>{slot.label}</Button>;
}
