import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useSlateElement } from "@/lib/emails/hooks/use-slate-element";
import { useSubscribeToEmailEditorEventContext } from "@/lib/emails/hooks/use-subscribe-to-key-down-event-context";
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
  const [focusedIndex, setFocusedIndex] = useState(0);

  const [variableQuery, setVariableQuery] = useState<string | null>(null);
  const editor = useSlate();
  const autocompleteContainerRef = useRef<HTMLDivElement>(null);
  const [insideVariable, variablePath] = useSlateElement("variable");

  const filteredVariables = VALID_VARIABLES.filter((v) =>
    v.includes(variableQuery ?? ""),
  );

  function getVariableBounds() {
    if (!editor.selection || !Range.isCollapsed(editor.selection)) return;

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

    return {
      openingBrace,
      variableBlockEnd,
      text,
      path: editor.selection.anchor.path,
    };
  }

  useSubscribeToEmailEditorEventContext({
    id: "insert-variable-button",
    onKeyDown: (e) => {
      if (e.key === "Enter" && insideVariable) {
        e.preventDefault();
      }

      if (e.key === "Escape") {
        setShowAutocomplete(false);
      }

      if (showAutocomplete) {
        switch (e.key) {
          case "ArrowUp":
            setFocusedIndex(
              (x) =>
                (x - 1 + filteredVariables.length) % filteredVariables.length,
            );
            e.preventDefault();
            break;
          case "ArrowDown":
            setFocusedIndex((x) => (x + 1) % filteredVariables.length);
            e.preventDefault();
            break;
          case "Enter":
            insertVariable(filteredVariables[focusedIndex]);
            e.preventDefault();
            break;
        }
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

      const bounds = getVariableBounds();
      if (!bounds) return;

      const { openingBrace, variableBlockEnd, text } = bounds;

      if (!text) return;

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

      setVariableQuery(variableName);
      requestAnimationFrame(() => {
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
      });
      setShowAutocomplete(true);

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

  function insertVariable(name: string) {
    const bounds = getVariableBounds();
    if (!bounds) return;
    const { openingBrace, path, text, variableBlockEnd } = bounds;

    Transforms.insertText(editor, name, {
      at: {
        anchor: {
          path,
          offset: openingBrace + 1,
        },
        focus: {
          path: path,
          offset: variableBlockEnd < 0 ? text.length : variableBlockEnd,
        },
      },
    });
  }

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
        className={cn(
          "bg-popover fixed left-0 top-0 z-50 flex max-h-64 flex-col gap-1 rounded-md border p-2",
          filteredVariables.length === 0 && "p-0",
        )}
        ref={autocompleteContainerRef}
      >
        {filteredVariables.map((v, i) => (
          <Button
            key={v}
            variant="ghost"
            className={cn("justify-start", focusedIndex === i && "bg-accent!")}
            onClick={() => {
              insertVariable(v);
              setVariableQuery(null);
            }}
          >
            {v}
          </Button>
        ))}
      </motion.div>
    </>
  );
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
