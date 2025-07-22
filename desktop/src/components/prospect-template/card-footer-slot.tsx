import { CardFooterSlot as CardFooterSlotType } from "@/lib/prospect-template/card-footer-slot";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import { CardFooter } from "../ui/card";
import ButtonSlot from "./button-slot";

export default function CardFooterSlot({
  slot,
}: RenderSlotProps<CardFooterSlotType>) {
  return (
    <CardFooter>
      {slot.buttons.map((button, index) => (
        <ButtonSlot key={index} slot={button} />
      ))}
    </CardFooter>
  );
}
