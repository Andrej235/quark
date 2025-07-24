import { BaseSlot } from "./base-slot";
import { ButtonSlot } from "./button-slot";
import { CardFooterSlot } from "./card-footer-slot";
import { CardHeaderSlot } from "./card-header-slot";
import { CardSlot } from "./card-slot";
import { ColumnSlot } from "./column-slot";
import { ImageFieldSlot } from "./image-field-slot";
import { RowSlot } from "./row-slot";
import { TextFieldSlot } from "./text-field-slot";

type Slot =
  | RowSlot
  | ColumnSlot
  | CardSlot
  | CardHeaderSlot
  | CardFooterSlot
  | ButtonSlot
  | TextFieldSlot
  | ImageFieldSlot;

type SafeSlot = Extract<Slot, Slot extends BaseSlot ? Slot : never>;

export type { SafeSlot as Slot };
