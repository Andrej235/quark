import {
  Bold,
  Braces,
  Image,
  Italic,
  Mail,
  Paperclip,
  Sparkles,
  Strikethrough,
  Underline,
} from "lucide-react";
import { Separator as ShadcnSeparator } from "../ui/separator";
import EditorSelectAlignSelect from "./email-template-editor-align-select";
import EditorButton from "./email-template-editor-button";
import EditorListDropdown from "./email-template-editor-list-dropdown";
import EditorToggle from "./email-template-editor-toggle";
import FontSizeDropdown from "./font-size-dropdown";
import EmailTemplateInsertLinkButton from "./insert-link-button";

export default function EmailTemplateEditorToolbar() {
  return (
    <div className="bg-background mb-2 flex items-stretch gap-1.5 rounded-md border px-2 py-1">
      <EditorButton icon={Braces} name="Insert Variable" />
      <EditorButton icon={Sparkles} name="Insert AI Block" />

      <Separator />

      <EditorToggle icon={Bold} name="Bold" mark="bold" />
      <EditorToggle icon={Italic} name="Italic" mark="italic" />
      <EditorToggle icon={Underline} name="Underline" mark="underline" />
      <EditorToggle
        icon={Strikethrough}
        name="Strikethrough"
        mark="strikethrough"
      />

      <Separator />

      <FontSizeDropdown />

      <Separator />

      <EditorSelectAlignSelect />
      <EditorListDropdown />

      <Separator />

      <EditorButton icon={Image} name="Insert Image" />
      <EmailTemplateInsertLinkButton />
      <EditorButton icon={Mail} name="Insert Email" />

      <Separator />

      <EditorButton icon={Paperclip} name="Attach File" />
    </div>
  );
}

function Separator() {
  return <ShadcnSeparator orientation="vertical" className="h-6! my-auto" />;
}
