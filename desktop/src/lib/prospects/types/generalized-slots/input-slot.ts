import { DropdownSlot } from "../slots/dropdown-slot";
import { ImageFieldSlot } from "../slots/image-field-slot";
import { RichTextFieldSlot } from "../slots/rich-text-field-slot";
import { TextFieldSlot } from "../slots/text-field-slot";

export type InputSlot =
  | TextFieldSlot
  | RichTextFieldSlot
  | ImageFieldSlot
  | DropdownSlot;
