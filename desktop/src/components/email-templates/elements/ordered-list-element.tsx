import { RenderElementProps } from "slate-react";

export default function OrderedListElement({
  attributes,
  children,
  element,
}: RenderElementProps) {
  if (element.type !== "ordered-list") return null;

  return <ol {...attributes}>{children}</ol>;
}
