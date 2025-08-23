import { KeyboardEvent, useMemo, useState } from "react";
import { createEditor, Descendant, Editor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import EmailTemplateEditorToolbar from "./email-template-editor-toolbar";
import Leaf from "./leaf";
import RenderElement from "./render-element";

export default function EmailTemplateEditor() {
  const editor: Editor = useMemo(
    () => withHistory(withReact(createEditor())),
    [],
  );

  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "Hello World!" }],
    },
  ]);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      editor.insertText("\n"); // soft break
    }
  }

  return (
    <div className="bg-card rounded-md border p-4">
      <Slate editor={editor} onChange={setValue} initialValue={value}>
        <EmailTemplateEditorToolbar />

        <Editable
          placeholder="Write your email template..."
          spellCheck
          autoFocus
          className="outline-0! prose prose-invert prose-p:text-base min-w-full"
          renderElement={RenderElement}
          renderLeaf={Leaf}
          onKeyDown={onKeyDown}
        />
      </Slate>
    </div>
  );
}
