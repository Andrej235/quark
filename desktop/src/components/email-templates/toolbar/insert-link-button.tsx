import ToolbarButton from "@/components/email-templates/toolbar/toolbar-button";
import { useSlateElement } from "@/lib/emails/hooks/use-slate-element";
import { Link } from "lucide-react";
import { useState } from "react";
import { Node, Text, Transforms } from "slate";
import { useSlate } from "slate-react";
import EmailTemplateInsertLinkDialog from "./insert-link-dialog";

export default function InsertLinkButton() {
  const editor = useSlate();

  const [element, path] = useSlateElement("link");
  const [enteringLink, setEnteringLink] = useState(false);

  function handleClick() {
    // If there's no link element selected, open the link dialog
    if (!element || !path) {
      setEnteringLink(true);
      return;
    }

    // Otherwise remove the selected link leaving it's text
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
        icon={Link}
        name="Insert Link"
        onClick={handleClick}
        className={element ? "bg-accent border-border" : ""}
      />

      <EmailTemplateInsertLinkDialog
        open={enteringLink}
        setOpen={setEnteringLink}
      />
    </>
  );
}
