import { CardHeaderSlot as CardHeaderSlotType } from "@/lib/prospect-template/card-header-slot";
import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
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
