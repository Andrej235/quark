import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { useSlateElement } from "@/lib/emails/hooks/use-slate-element";
import { useSubscribeToEmailEditorEventContext } from "@/lib/emails/hooks/use-subscribe-to-key-down-event-context";
import { VariableElement } from "@/lib/emails/types/elements/variable-element";
import toTitleCase from "@/lib/format/title-case";
import { Braces } from "lucide-react";
import { useRef, useState } from "react";
import { Editor, Element, Path, Range, Transforms } from "slate";
import { useSlate } from "slate-react";
import ToolbarButton from "./toolbar-button";

const VALID_VARIABLES = [
  "user.firstName",
  "user.lastName",
  "account.plan",
  "order.total",
];

export default function InsertVariableButton() {
  const [variableQuery, setVariableQuery] = useState<string | null>(null);
  const targetRange = useRef<Range | null>(null);
  const editor = useSlate();
  const [insideVariable] = useSlateElement("variable");

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
    },
    onChange: (x) => {
      if (x?.type !== "insert_text" && x?.type !== "remove_text") return;

      // Inside a variable element already
      if (
        Editor.above(editor, {
          match: (n) => Element.isElement(n) && n.type === "variable",
        })
      )
        return;

      const caret = editor.selection!.anchor.offset;
      const text = Editor.string(
        editor,
        Editor.node(editor, editor.selection!)[1],
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

      if (openingBrace === -1) return;

      const variableName = text.slice(
        openingBrace + 1,
        variableBlockEnd < 0 ? text.length : variableBlockEnd,
      );

      const completedVariableName =
        text[variableBlockEnd] === "}" ||
        (text[variableBlockEnd] === " " &&
          x?.type === "insert_text" &&
          x.text === "}");

      if (!completedVariableName || !VALID_VARIABLES.includes(variableName))
        return;

      // There is nothing after the variable, add a space just so the caret's position doesn't get messed up
      if (variableBlockEnd === text.length - 1) {
        Transforms.insertText(editor, " ", {
          at: {
            anchor: {
              path: editor.selection!.anchor.path,
              offset: variableBlockEnd + 1,
            },
            focus: {
              path: editor.selection!.focus.path,
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
              path: editor.selection!.anchor.path,
              offset: openingBrace,
            },
            focus: {
              path: editor.selection!.focus.path,
              offset: variableBlockEnd,
            },
            offset: openingBrace,
            path: editor.selection!.anchor.path,
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

  return (
    <>
      <ToolbarButton
        icon={Braces}
        name="Insert Variable"
        className={insideVariable ? "bg-accent" : ""}
      />

      <Popover open={!!variableQuery}>
        <PopoverContent className="w-64 p-0">
          <Command>
            <CommandInput value={variableQuery ?? ""} />
            <CommandList>
              {VALID_VARIABLES.filter((v) =>
                v.includes(variableQuery ?? ""),
              ).map((v) => (
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
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
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
