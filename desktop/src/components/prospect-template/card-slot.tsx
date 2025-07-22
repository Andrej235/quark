import { CardSlot as CardSlotType } from "@/lib/prospect-template/card-slot";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import { Card, CardContent } from "../ui/card";
import CardFooterSlot from "./card-footer-slot";
import CardHeaderSlot from "./card-header-slot";
import RenderSlot from "./render-slot";

export default function CardSlot({ slot }: RenderSlotProps<CardSlotType>) {
  return (
    <Card>
      {slot.header && <CardHeaderSlot slot={slot.header} />}

      <CardContent>
        <RenderSlot slot={slot.content} />
      </CardContent>

      {slot.footer && <CardFooterSlot slot={slot.footer} />}
    </Card>
  );
}
