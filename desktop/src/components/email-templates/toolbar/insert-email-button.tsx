import ToolbarButton from "@/components/email-templates/toolbar/toolbar-button";
import { useSlateElement } from "@/lib/emails/hooks/use-slate-element";
import { Mail } from "lucide-react";
import { useState } from "react";
import { Node, Text, Transforms } from "slate";
import { useSlate } from "slate-react";
import InsertEmailDialog from "./insert-email-dialog";

export default function InsertEmailButton() {
  const editor = useSlate();

  const [element, path] = useSlateElement("email-address");
  const [enteringEmail, setEnteringEmail] = useState(false);

  function handleClick() {
    // If there's no email element selected, open the email dialog
    if (!element || !path) {
      setEnteringEmail(true);
      return;
    }

    // Otherwise remove the selected email leaving it's text
    for (const [child, childPath] of Node.children(editor, path)) {
      if (Text.isText(child)) {
        Transforms.setNodes(
          editor,
          { italic: undefined, underline: undefined },
          { at: childPath },
        );
      }
    }

    Transforms.unwrapNodes(editor, { at: path });
  }

  return (
    <>
      <ToolbarButton
        icon={Mail}
        name="Insert Email"
        onClick={handleClick}
        className={element ? "bg-accent border-border" : ""}
      />

      <InsertEmailDialog open={enteringEmail} setOpen={setEnteringEmail} />
    </>
  );
}
