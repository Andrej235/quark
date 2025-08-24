import { Element } from "slate";
import { InlineElement } from "../types/generalized-elements/inline-element";

export function isInline(element: Element): element is InlineElement {
  const inlineElements: string[] = [
    "link",
    "email-address",
    "variable",
  ] satisfies InlineElement["type"][];

  return inlineElements.includes(element.type);
}
