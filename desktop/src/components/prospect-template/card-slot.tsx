import { CardSlot as CardSlotType } from "@/lib/prospect-template/card-slot";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import { Card, CardContent } from "../ui/card";
import RenderSlot from "./render-slot";

export default function CardSlot({ slot }: RenderSlotProps<CardSlotType>) {
  return (
    <Card className="px-6">
      {slot.header && <RenderSlot slot={slot.header} />}

      <CardContent className="px-0">
        <RenderSlot slot={slot.content} />
      </CardContent>

      {slot.footer && <RenderSlot slot={slot.footer} />}
    </Card>
  );
}
