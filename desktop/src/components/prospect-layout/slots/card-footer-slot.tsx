import { RenderSlotProps } from "@/lib/prospects/types/slots-utility/render-slot-props";
import type { CardFooterSlot as CardFooterSlotType } from "@/lib/prospects/types/slots/card-footer-slot";
import { CardFooter } from "../../ui/card";
import RenderSlot from "../render-slot";

export default function CardFooterSlot({
  slot,
}: RenderSlotProps<CardFooterSlotType>) {
  return (
    <CardFooter className="gap-4 px-2">
      {slot.buttons.length === 0 && (
        <>
          <div className="bg-muted-foreground/50 h-8 w-32 rounded-md" />
          <div className="bg-muted-foreground/50 h-8 w-24 rounded-md" />
          <div className="bg-muted-foreground/50 h-8 w-48 rounded-md" />
        </>
      )}

      {slot.buttons.map((button, index) => (
        <RenderSlot key={index} slot={button} />
      ))}
    </CardFooter>
  );
}
