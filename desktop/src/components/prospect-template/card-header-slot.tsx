import { CardHeaderSlot as CardHeaderSlotType } from "@/lib/prospects/slot-types/card-header-slot";
import { RenderSlotProps } from "@/lib/prospects/slot-types/render-slot-props";
import { CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function CardHeaderSlot({
  slot,
}: RenderSlotProps<CardHeaderSlotType>) {
  return (
    <CardHeader className="px-0">
      <CardTitle>{slot.title}</CardTitle>

      {slot.description && (
        <CardDescription>{slot.description}</CardDescription>
      )}
    </CardHeader>
  );
}
