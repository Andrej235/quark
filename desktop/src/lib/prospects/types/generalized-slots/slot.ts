import { ButtonSlot } from "../slots/button-slot";
import { CardFooterSlot } from "../slots/card-footer-slot";
import { CardHeaderSlot } from "../slots/card-header-slot";
import { CardSlot } from "../slots/card-slot";
import { ColumnSlot } from "../slots/column-slot";
import { DropdownSlot } from "../slots/dropdown-slot";
import { ImageFieldSlot } from "../slots/image-field-slot";
import { RichTextFieldSlot } from "../slots/rich-text-field-slot";
import { RowSlot } from "../slots/row-slot";
import { TextFieldSlot } from "../slots/text-field-slot";

export type SlotType =
  | "card"
  | "card-header"
  | "card-footer"
  | "row"
  | "column"
  | "button"
  | "text-field"
  | "rich-text-field"
  | "image-field"
  | "dropdown";

type BaseSlot = {
  id: string;
  type: SlotType;
};

type UnsafeSlot =
  | RowSlot
  | ColumnSlot
  | CardSlot
  | CardHeaderSlot
  | CardFooterSlot
  | ButtonSlot
  | TextFieldSlot
  | RichTextFieldSlot
  | ImageFieldSlot
  | DropdownSlot;

type SafeSlot = Extract<
  UnsafeSlot,
  UnsafeSlot extends BaseSlot ? UnsafeSlot : never
>;

type SpecificSlot<
  TType extends SlotType,
  TSlot extends SafeSlot,
> = TSlot extends {
  type: TType;
}
  ? TSlot
  : never;

type Slot<Type extends SlotType = SlotType> = SpecificSlot<Type, SafeSlot>;

export type { Slot };
