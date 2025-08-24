import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { useSubscribeToEmailEditorEventContext } from "@/lib/emails/hooks/use-subscribe-to-key-down-event-context";
import { VariableElement } from "@/lib/emails/types/elements/variable-element";
import { Braces } from "lucide-react";
import { useRef, useState } from "react";
import { Editor, Element, Range, Transforms } from "slate";
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

  useSubscribeToEmailEditorEventContext({
    id: "insert-variable-button",
    onChange: (x) => {
      if (x?.type !== "insert_text" && x?.type !== "remove_text") return;

      const caret = editor.selection!.anchor.offset;
      const line = Editor.above(editor, {
        match: (x) => {
          return Element.isElement(x) && x.type === "paragraph";
        },
      });

      const text = line ? Editor.string(editor, line[1]) : null;
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

      console.log("Wrap in variable element");
      Transforms.insertNodes(
        editor,
        {
          type: "variable",
          name: variableName,
          children: [{ text: "" }],
        },
        {
          at: {
            anchor: {
              path: editor.selection!.anchor.path,
              offset: openingBrace,
            },
            focus: {
              path: editor.selection!.focus.path,
              offset: variableBlockEnd + 1,
            },
          },
        },
      );

      /*       Transforms.wrapNodes(
        editor,
        {
          type: "variable",
          name: variableName,
          children: [{ text: "" }],
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
          },
        },
      ); */
    },
  });

  return (
    <>
      <ToolbarButton icon={Braces} name="Insert Variable" />

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
    name,
    children: [{ text: "" }],
  };

  Transforms.insertNodes(editor, variable);
}
