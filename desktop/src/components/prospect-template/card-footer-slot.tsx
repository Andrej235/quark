import { CardFooterSlot as CardFooterSlotType } from "@/lib/prospects/slot-types/card-footer-slot";
import { RenderSlotProps } from "@/lib/prospects/slot-types/render-slot-props";
import { CardFooter } from "../ui/card";
import RenderSlot from "./render-slot";

export default function CardFooterSlot({
  slot,
}: RenderSlotProps<CardFooterSlotType>) {
  return (
    <CardFooter className="px-2">
      {slot.buttons.length === 0 && (
        <>
          <div className="bg-muted-foreground/50 mr-4 h-8 w-32 rounded-md" />
          <div className="bg-muted-foreground/50 mr-4 h-8 w-24 rounded-md" />
          <div className="bg-muted-foreground/50 mr-4 h-8 w-48 rounded-md" />
        </>
      )}

      {slot.buttons.map((button, index) => (
        <RenderSlot key={index} slot={button} />
      ))}
    </CardFooter>
  );
}
