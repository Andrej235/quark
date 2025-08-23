import { RenderLeafProps } from "slate-react";

export default function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  if (leaf.strikethrough) children = <s>{children}</s>;

  return (
    <span
      style={{
        fontSize: (leaf.fontSize || 10) * 1.33,
      }}
      {...attributes}
    >
      {children}
    </span>
  );
}
