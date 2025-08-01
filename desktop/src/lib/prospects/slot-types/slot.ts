import { BaseSlot } from "./base-slot";
import { ButtonSlot } from "./button-slot";
import { CardFooterSlot } from "./card-footer-slot";
import { CardHeaderSlot } from "./card-header-slot";
import { CardSlot } from "./card-slot";
import { ColumnSlot } from "./column-slot";
import { ImageFieldSlot } from "./image-field-slot";
import { RowSlot } from "./row-slot";
import { SlotType } from "./slot-type";
import { TextFieldSlot } from "./text-field-slot";

type UnsafeSlot =
  | RowSlot
  | ColumnSlot
  | CardSlot
  | CardHeaderSlot
  | CardFooterSlot
  | ButtonSlot
  | TextFieldSlot
  | ImageFieldSlot;

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
