import { useIsSlotInEditMode } from "@/contexts/slot-edit-context";
import { RenderSlotProps } from "@/lib/prospects/slot-types/render-slot-props";
import { useMemo } from "react";
import ButtonSlot from "./button-slot";
import CardSlot from "./card-slot";
import ColumnSlot from "./column-slot";
import ImageFieldSlot from "./image-field-slot";
import RowSlot from "./row-slot";
import SlotEditWrapper from "./slot-edit-wrapper";
import TextFieldSlot from "./text-field-slot";
import CardFooterSlot from "./card-footer-slot";
import CardHeaderSlot from "./card-header-slot";

export default function RenderSlot({
  slot,
  forceNoEditMode,
}: RenderSlotProps & { forceNoEditMode?: boolean }) {
  const isEditMode = useIsSlotInEditMode();

  const slotJsx = useMemo(() => {
    switch (slot.type) {
      case "row":
        return <RowSlot slot={slot} />;
      case "column":
        return <ColumnSlot slot={slot} />;
      case "card":
        return <CardSlot slot={slot} />;
      case "card-header":
        return <CardHeaderSlot slot={slot} />;
      case "card-footer":
        return <CardFooterSlot slot={slot} />;
      case "button":
        return <ButtonSlot slot={slot} />;
      case "text-field":
        return <TextFieldSlot slot={slot} />;
      case "image-field":
        return <ImageFieldSlot slot={slot} />;
      default:
        return null;
    }
  }, [slot]);

  if (!forceNoEditMode && isEditMode) {
    return <SlotEditWrapper slot={slot}>{slotJsx}</SlotEditWrapper>;
  }

  return slotJsx;
}
