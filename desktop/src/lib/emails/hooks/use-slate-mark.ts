import { Editor } from "slate";
import { useSlate } from "slate-react";
import { TextMarks } from "../types/generalized-elements/text-marks";

export function useSlateMark(mark: TextMarks) {
  const editor = useSlate();

  const isOn = !!Editor.marks(editor)?.[mark];

  const toggleMark = (value?: boolean) => {
    const marks = Editor.marks(editor);

    if (value !== undefined) {
      if (value) Editor.addMark(editor, mark, true);
      else Editor.removeMark(editor, mark);
      return;
    }

    if (marks?.[mark]) Editor.removeMark(editor, mark);
    else Editor.addMark(editor, mark, true);
  };

  return [isOn, toggleMark] as const;
}
