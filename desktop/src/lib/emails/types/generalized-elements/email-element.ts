import { EmailAddressElement } from "../elements/email-address-element";
import { LinkElement } from "../elements/link-element";
import { ListItemElement } from "../elements/list-item-element";
import { OrderedListElement } from "../elements/ordered-list-element";
import { ParagraphElement } from "../elements/paragraph-element";
import { UnorderedListElement } from "../elements/unordered-list-element";
import { VariableElement } from "../elements/variable-element";

export type EmailElementType =
  | "paragraph"
  | "link"
  | "email-address"
  | "list-item"
  | "unordered-list"
  | "ordered-list"
  | "variable";

type BaseEmailElement = {
  type: EmailElementType;
};

type UnsafeEmailElement =
  | ParagraphElement
  | LinkElement
  | EmailAddressElement
  | ListItemElement
  | UnorderedListElement
  | OrderedListElement
  | VariableElement;

type SafeEmailElement = Extract<
  UnsafeEmailElement,
  UnsafeEmailElement extends BaseEmailElement ? UnsafeEmailElement : never
>;

type SpecificEmailElement<
  TType extends EmailElementType,
  TEmailElement extends SafeEmailElement,
> = TEmailElement extends {
  type: TType;
}
  ? TEmailElement
  : never;

type EmailElement<Type extends EmailElementType = EmailElementType> =
  SpecificEmailElement<Type, SafeEmailElement>;

export type { EmailElement };
