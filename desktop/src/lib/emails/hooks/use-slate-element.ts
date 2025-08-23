import { Editor, Element, Path } from "slate";
import { useSlate } from "slate-react";
import {
  EmailElement,
  EmailElementType,
} from "../types/generalized-elements/email-element";

export function useSlateElement<TType extends EmailElementType | undefined>(
  type?: TType,
): [
  element:
    | (TType extends EmailElementType ? EmailElement<TType> : EmailElement)
    | null,
  path: Path | null,
] {
  const editor = useSlate();
  const [match] = Editor.nodes(editor, {
    match: type
      ? (n) => Element.isElement(n) && n.type === type
      : (n) => Element.isElement(n),
  });

  return [
    (match?.[0] ?? null) as TType extends EmailElementType
      ? EmailElement<TType>
      : EmailElement,
    match?.[1] ?? null,
  ];
}
