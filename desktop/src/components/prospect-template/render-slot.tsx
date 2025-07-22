import { Slot } from "@/lib/prospect-template/slot";
import ButtonSlot from "./button-slot";
import CardSlot from "./card-slot";
import ColumnSlot from "./column-slot";
import RowSlot from "./row-slot";
import TextFieldSlot from "./text-field-slot";
import ImageFieldSlot from "./image-field-slot";

export default function RenderSlot({ slot }: { slot: Slot }) {
  switch (slot.type) {
    case "row":
      return <RowSlot slot={slot} />;
    case "column":
      return <ColumnSlot slot={slot} />;
    case "card":
      return <CardSlot slot={slot} />;
    case "button":
      return <ButtonSlot slot={slot} />;
    case "text-field":
      return <TextFieldSlot slot={slot} />;
    case "image-field":
      return <ImageFieldSlot slot={slot} />;
    default:
      return null;
  }
}
