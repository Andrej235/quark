import { Editor } from "slate";
import { isInline as inlineTypeCheck } from "../type-checks/is-inline";

export function withInline(editor: Editor) {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return inlineTypeCheck(element) || isInline(element);
  };

  return editor;
}
