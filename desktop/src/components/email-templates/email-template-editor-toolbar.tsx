import {
  Bold,
  Braces,
  Image,
  Italic,
  Link,
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
import FontSizeDropdown from "./font-size-dropdown";

export default function EmailTemplateEditorToolbar() {
  return (
    <div className="bg-background mb-2 flex items-stretch gap-1.5 rounded-md border px-2 py-1">
      <EditorButton icon={Braces} name="Insert Variable" />
      <EditorButton icon={Sparkles} name="Insert AI Block" />

      <Separator />

      <EditorButton icon={Bold} name="Bold" />
      <EditorButton icon={Italic} name="Italic" />
      <EditorButton icon={Underline} name="Underline" />
      <EditorButton icon={Strikethrough} name="Strikethrough" />

      <Separator />

      <FontSizeDropdown />

      <Separator />

      <EditorSelectAlignSelect />
      <EditorListDropdown />

      <Separator />

      <EditorButton icon={Image} name="Insert Image" />
      <EditorButton icon={Link} name="Insert Link" />
      <EditorButton icon={Mail} name="Insert Email" />

      <Separator />

      <EditorButton icon={Paperclip} name="Attach File" />
    </div>
  );
}

function Separator() {
  return <ShadcnSeparator orientation="vertical" className="h-6! my-auto" />;
}
