import { useIsSlotInEditMode } from "@/contexts/slot-tree-context";
import { RenderSlotProps } from "@/lib/prospects/types/slots-utility/render-slot-props";
import { useMemo } from "react";
import SlotEditWrapper from "./slot-edit-wrapper";
import ButtonSlot from "./slots/button-slot";
import CardFooterSlot from "./slots/card-footer-slot";
import CardHeaderSlot from "./slots/card-header-slot";
import CardSlot from "./slots/card-slot";
import ColumnSlot from "./slots/column-slot";
import DropdownSlot from "./slots/dropdown-slot";
import ImageFieldSlot from "./slots/image-field-slot";
import RichTextFieldSlot from "./slots/rich-text-field-slot";
import RowSlot from "./slots/row-slot";
import TextFieldSlot from "./slots/text-field-slot";

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
      case "rich-text-field":
        return <RichTextFieldSlot slot={slot} />;
      case "image-field":
        return <ImageFieldSlot slot={slot} />;
      case "dropdown":
        return <DropdownSlot slot={slot} />;
      default:
        return null;
    }
  }, [slot]);

  if (!forceNoEditMode && isEditMode) {
    return <SlotEditWrapper slot={slot}>{slotJsx}</SlotEditWrapper>;
  }

  return slotJsx;
}
