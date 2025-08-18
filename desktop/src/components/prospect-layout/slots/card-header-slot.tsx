import { RenderSlotProps } from "@/lib/prospects/types/slots-utility/render-slot-props";
import { CardDescription, CardHeader, CardTitle } from "../../ui/card";

export default function CardHeaderSlot({
  slot,
}: RenderSlotProps<"card-header">) {
  return (
    <CardHeader className="px-0">
      <CardTitle>{slot.title}</CardTitle>

      {slot.description && (
        <CardDescription>{slot.description}</CardDescription>
      )}
    </CardHeader>
  );
}
