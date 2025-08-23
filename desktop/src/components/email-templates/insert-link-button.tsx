import EditorButton from "@/components/email-templates/email-template-editor-button";
import { Link } from "lucide-react";
import { useState } from "react";
import EmailTemplateInsertLinkDialog from "./email-template-insert-link-dialog";

export default function InsertLinkButton() {
  const [enteringLink, setEnteringLink] = useState(false);

  function handleClick() {
    setEnteringLink(true);
  }

  return (
    <>
      <EditorButton icon={Link} name="Insert Link" onClick={handleClick} />

      <EmailTemplateInsertLinkDialog
        open={enteringLink}
        setOpen={setEnteringLink}
      />
    </>
  );
}
