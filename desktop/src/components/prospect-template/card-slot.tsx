import { RenderSlotProps } from "@/lib/prospects/types/slots-utility/render-slot-props";
import { CardSlot as CardSlotType } from "@/lib/prospects/types/slots/card-slot";
import { Card, CardContent } from "../ui/card";
import RenderSlot from "./render-slot";

export default function CardSlot({ slot }: RenderSlotProps<CardSlotType>) {
  return (
    <Card className="px-6">
      {slot.header && <RenderSlot slot={slot.header} />}

      <CardContent className="px-0">
        {slot.content && <RenderSlot slot={slot.content} />}
      </CardContent>

      {slot.footer && <RenderSlot slot={slot.footer} />}
    </Card>
  );
}
