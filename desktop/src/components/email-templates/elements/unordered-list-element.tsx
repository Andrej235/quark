import { RenderElementProps } from "slate-react";

export default function UnorderedListElement({
  attributes,
  children,
  element,
}: RenderElementProps) {
  if (element.type !== "unordered-list") return null;

  return <ul {...attributes}>{children}</ul>;
}
