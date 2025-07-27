import { CardFooterSlot as CardFooterSlotType } from "@/lib/prospects/slot-types/card-footer-slot";
import { RenderSlotProps } from "@/lib/prospects/slot-types/render-slot-props";
import { CardFooter } from "../ui/card";
import RenderSlot from "./render-slot";

export default function CardFooterSlot({
  slot,
}: RenderSlotProps<CardFooterSlotType>) {
  return (
    <CardFooter className="px-2">
      {slot.buttons.map((button, index) => (
        <RenderSlot key={index} slot={button} />
      ))}
    </CardFooter>
  );
}
