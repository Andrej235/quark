import { RenderElementProps } from "slate-react";

export default function LinkElement({
  attributes,
  children,
  element,
}: RenderElementProps) {
  if (element.type !== "link") return null;

  return (
    <a {...attributes} href={element.url}>
      {children}
    </a>
  );
}
