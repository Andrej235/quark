import { RenderElementProps } from "slate-react";

export default function ParagraphElement({
  attributes,
  children,
  element,
}: RenderElementProps) {
  if (element.type !== "paragraph") return null;

  return (
    <p
      {...attributes}
      style={{ textAlign: element.align ?? "left" }}
      className="my-2!"
    >
      {children}
    </p>
  );
}
