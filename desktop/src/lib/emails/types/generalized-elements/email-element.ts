import { LinkElement } from "../elements/link-element";
import { ParagraphElement } from "../elements/paragraph-element";

export type EmailElementType = "paragraph" | "link";

type BaseEmailElement = {
  type: EmailElementType;
};

type UnsafeEmailElement = ParagraphElement | LinkElement;

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
