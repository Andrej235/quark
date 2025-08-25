import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSlateElement } from "@/lib/emails/hooks/use-slate-element";
import { useSubscribeToEmailEditorEventContext } from "@/lib/emails/hooks/use-subscribe-to-key-down-event-context";
import { VariableElement } from "@/lib/emails/types/elements/variable-element";
import toTitleCase from "@/lib/format/title-case";
import { Braces } from "lucide-react";
import { animate, motion } from "motion/react";
import { useRef, useState } from "react";
import { Editor, Element, Path, Range, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import ToolbarButton from "./toolbar-button";

const VALID_VARIABLES = [
  "user.firstName",
  "user.lastName",
  "account.plan",
  "order.total",
];

export default function InsertVariableButton() {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [variableQuery, setVariableQuery] = useState<string | null>(null);
  const targetRange = useRef<Range | null>(null);
  const editor = useSlate();
  const autocompleteContainerRef = useRef<HTMLDivElement>(null);
  const [insideVariable, variablePath] = useSlateElement("variable");

  useSubscribeToEmailEditorEventContext({
    id: "insert-variable-button",
    onKeyDown: (e) => {
      if (
        e.key === "Enter" &&
        Editor.above(editor, {
          match: (n) => Element.isElement(n) && n.type === "variable",
        })
      ) {
        e.preventDefault();
      }

      if (e.key === "Escape") {
        setShowAutocomplete(false);
      }
    },
    onChange: (x) => {
      if (
        x?.type !== "insert_text" &&
        x?.type !== "remove_text" &&
        x?.type !== "set_selection"
      )
        return;

      if (!editor.selection || !Range.isCollapsed(editor.selection)) return;

      // Inside a variable element already
      if (
        Editor.above(editor, {
          match: (n) => Element.isElement(n) && n.type === "variable",
        })
      )
        return;

      const caret = editor.selection.anchor.offset;
      const text = Editor.string(
        editor,
        Editor.node(editor, editor.selection)[1],
      );
      if (!text) return;

      let openingBrace = -1;
      let variableBlockEnd = -1;

      for (let i = caret - 1; i >= 0; i--) {
        if (/[\s}]/.test(text[i])) {
          if (caret - 1 !== i || text[caret - 1] !== "}") break;
        }

        if (text[i] === "{") {
          openingBrace = i;
          break;
        }
      }

      for (let i = caret - 1; i < text.length; i++) {
        if (/[\s}]/.test(text[i])) {
          variableBlockEnd = i;
          break;
        }
      }

      if (openingBrace === -1) {
        setShowAutocomplete(false);
        return;
      }

      const variableName = text.slice(
        openingBrace + 1,
        variableBlockEnd < 0 ? text.length : variableBlockEnd,
      );

      const completedVariableName =
        text[variableBlockEnd] === "}" ||
        (text[variableBlockEnd] === " " &&
          x?.type === "insert_text" &&
          x.text === "}");

      setShowAutocomplete(true);
      setVariableQuery(variableName);
      const rect = getCaretScreenPosition(editor);
      if (rect) {
        const yOffset = 5;
        const containerApproxHeight = Math.max(
          autocompleteContainerRef.current!.offsetHeight,
          128,
        );

        let y = rect.y + rect.height + yOffset;
        if (window.innerHeight - y < containerApproxHeight) {
          y -= containerApproxHeight;
        }

        animate(
          autocompleteContainerRef.current!,
          {
            x: rect.x + rect.width,
            y,
          },
          {
            duration: 0,
          },
        );
      }

      if (!completedVariableName || !VALID_VARIABLES.includes(variableName))
        return;

      // There is nothing after the variable, add a space just so the caret's position doesn't get messed up
      if (variableBlockEnd === text.length - 1) {
        Transforms.insertText(editor, " ", {
          at: {
            anchor: {
              path: editor.selection.anchor.path,
              offset: variableBlockEnd + 1,
            },
            focus: {
              path: editor.selection.focus.path,
              offset: variableBlockEnd + 1,
            },
          },
        });
      }

      Transforms.insertNodes(
        editor,
        {
          type: "variable",
          variable: variableName,
          children: [
            {
              text: toTitleCase(variableName.replace(".", " ")),
            },
          ],
        },
        {
          at: {
            anchor: {
              path: editor.selection.anchor.path,
              offset: openingBrace,
            },
            focus: {
              path: editor.selection.focus.path,
              offset: variableBlockEnd,
            },
            offset: openingBrace,
            path: editor.selection.anchor.path,
          },
        },
      );

      const [newVar] = Editor.nodes(editor, {
        match: (n) => {
          return Element.isElement(n) && n.type === "variable";
        },
      });
      editor.select(Path.next(newVar[1]));
    },
  });

  function handleClick() {
    if (insideVariable && variablePath) {
      Transforms.unwrapNodes(editor, {
        at: variablePath,
      });
      return;
    }

    const selection = editor.selection;
    if (!selection || !Range.isCollapsed(selection)) return;

    Transforms.insertText(editor, "{}", {
      at: selection,
    });
  }

  return (
    <>
      <ToolbarButton
        icon={Braces}
        name="Insert Variable"
        className={insideVariable ? "bg-accent" : ""}
        onClick={handleClick}
      />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.85,
        }}
        animate={{
          opacity: showAutocomplete ? 1 : 0,
          scale: showAutocomplete ? 1 : 0.8,
          pointerEvents: showAutocomplete ? "auto" : "none",
          touchAction: showAutocomplete ? "auto" : "none",
        }}
        transition={{
          duration: 0.2,
        }}
        className="bg-popover fixed left-0 top-0 z-50 max-h-64 rounded-md border p-2"
        ref={autocompleteContainerRef}
      >
        <Command>
          <CommandInput value={variableQuery ?? ""} />
          <CommandList>
            {VALID_VARIABLES.filter((v) => v.includes(variableQuery ?? "")).map(
              (v) => (
                <CommandItem
                  key={v}
                  onSelect={() => {
                    Transforms.delete(editor, { at: targetRange.current! });
                    insertVariable(editor, v);
                    setVariableQuery(null);
                    targetRange.current = null;
                  }}
                >
                  {v}
                </CommandItem>
              ),
            )}
          </CommandList>
        </Command>
      </motion.div>
    </>
  );
}

function insertVariable(editor: Editor, name: string) {
  const variable: VariableElement = {
    type: "variable",
    variable: name,
    children: [],
  };

  Transforms.insertNodes(editor, variable);
}

function getCaretScreenPosition(editor: Editor) {
  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection)) return null;

  try {
    const domRange = ReactEditor.toDOMRange(editor, selection);
    const rect = domRange.getBoundingClientRect();

    return {
      x: rect.left,
      y: rect.top,
      height: rect.height,
      width: rect.width,
    };
  } catch {
    return null;
  }
}
