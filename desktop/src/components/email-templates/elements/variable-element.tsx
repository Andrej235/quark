import { RenderElementProps } from "slate-react";

export default function VariableElement({
  attributes,
  element,
  children,
}: RenderElementProps) {
  if (element.type !== "variable") return null;

  return (
    <span
      {...attributes}
      className="bg-muted mx-1 inline-flex items-center rounded-md px-1.5 py-0.5"
    >
      {children}
    </span>
  );
}
