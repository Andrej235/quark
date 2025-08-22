import {
  Bold,
  Italic,
  Paperclip,
  Strikethrough,
  Underline,
} from "lucide-react";
import { Separator as ShadcnSeparator } from "../ui/separator";
import EditorSelectAlignSelect from "./email-template-editor-align-select";
import EditorButton from "./email-template-editor-button";
import FontSizeDropdown from "./font-size-dropdown";

export default function EmailTemplateEditorToolbar() {
  return (
    <div className="bg-background mb-2 flex items-stretch gap-1.5 rounded-md border px-2 py-1">
      <EditorButton icon={Paperclip} name="Attach File" />

      <Separator />

      <EditorButton icon={Bold} name="Bold" />
      <EditorButton icon={Italic} name="Italic" />
      <EditorButton icon={Underline} name="Underline" />
      <EditorButton icon={Strikethrough} name="Strikethrough" />

      <Separator />

      <FontSizeDropdown />

      <Separator />

      <EditorSelectAlignSelect />
    </div>
  );
}

function Separator() {
  return <ShadcnSeparator orientation="vertical" className="h-6! my-auto" />;
}
