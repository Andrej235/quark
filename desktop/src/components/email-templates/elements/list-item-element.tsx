import { RenderElementProps } from "slate-react";

export default function ListItemElement({
  attributes,
  children,
  element,
}: RenderElementProps) {
  if (element.type !== "list-item") return null;

  return <li {...attributes}>{children}</li>;
}
