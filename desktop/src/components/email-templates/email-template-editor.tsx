import { Editor } from "@/lib/emails/email-templates/slate";
import { useMemo, useState } from "react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";

export default function EmailTemplateEditor() {
  const editor: Editor = useMemo(
    () => withHistory(withReact(createEditor())),
    [],
  );

  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [
        { text: "Hello " },
        { type: "variable", name: "FirstName", children: [{ text: "" }] },
        { text: ", welcome to our newsletter!" },
      ],
    },
  ]);

  return (
    <div className="rounded border p-4">
      <div className="mb-2"></div>

      <Slate editor={editor} onChange={setValue} initialValue={value}>
        <Editable
          placeholder="Write your email template..."
          spellCheck
          autoFocus
        />
      </Slate>
    </div>
  );
}
