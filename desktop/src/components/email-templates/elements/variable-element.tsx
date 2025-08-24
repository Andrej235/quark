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
      contentEditable={false}
      className="bg-muted text-primary inline-flex items-center rounded px-1.5 py-0.5 font-mono text-sm"
    >
      {element.name}
      {children}
    </span>
  );
}
