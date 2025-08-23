import { Element } from "slate";

export function isInline(element: Element) {
  return element.type === "link";
}
