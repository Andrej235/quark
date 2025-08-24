import { onKeyDownEventContext } from "@/lib/emails/contexts/on-key-down-event-context";
import { withInline } from "@/lib/emails/with/with-inline";
import { KeyboardEvent, useRef, useState } from "react";
import { createEditor, Descendant, Editor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import Leaf from "./leaf";
import RenderElement from "./render-element";
import Toolbar from "./toolbar/toolbar";

export default function EmailTemplateEditor() {
  const [editor] = useState<Editor>(() =>
    withInline(withHistory(withReact(createEditor()))),
  );

  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "Hello World!" }],
    },
    {
      type: "paragraph",
      children: [{ text: "Hello World!" }],
    },
    {
      type: "paragraph",
      children: [{ text: "Hello World!" }],
    },
    {
      type: "paragraph",
      children: [{ text: "Hello World!" }],
    },
    {
      type: "paragraph",
      children: [{ text: "Hello World!" }],
    },
  ]);

  const keyDownSubscribers = useRef<{
    [id: string]: (event: KeyboardEvent) => void;
  }>({});

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      editor.insertText("\n"); // soft break
    }

    Object.entries(keyDownSubscribers.current).forEach(([, callback]) =>
      callback(event),
    );
  }

  return (
    <div className="bg-card rounded-md border p-4">
      <Slate editor={editor} onChange={setValue} initialValue={value}>
        <onKeyDownEventContext.Provider
          value={{
            onSubscribe: (id, callback) =>
              void (keyDownSubscribers.current[id] = callback),
          }}
        >
          <Toolbar />
        </onKeyDownEventContext.Provider>

        <Editable
          placeholder="Write your email template..."
          spellCheck
          autoFocus
          className="outline-0! prose prose-invert prose-p:text-base prose-a:font-normal prose-a:no-underline min-w-full"
          renderElement={RenderElement}
          renderLeaf={Leaf}
          onKeyDown={onKeyDown}
        />
      </Slate>
    </div>
  );
}
