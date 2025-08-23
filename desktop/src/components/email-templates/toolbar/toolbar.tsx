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
import { Separator as ShadcnSeparator } from "../../ui/separator";
import ListDropdown from "./list-dropdown";
import ToolbarToggle from "./toolbar-toggle";
import FontSizeDropdown from "./font-size-picker";
import EmailTemplateInsertLinkButton from "./insert-link-button";
import ToolbarButton from "./toolbar-button";
import TextAlignDropdown from "./text-align-dropdown";

export default function Toolbar() {
  return (
    <div className="bg-background mb-2 flex items-stretch gap-1.5 rounded-md border px-2 py-1">
      <ToolbarButton icon={Braces} name="Insert Variable" />
      <ToolbarButton icon={Sparkles} name="Insert AI Block" />

      <Separator />

      <ToolbarToggle icon={Bold} name="Bold" mark="bold" />
      <ToolbarToggle icon={Italic} name="Italic" mark="italic" />
      <ToolbarToggle icon={Underline} name="Underline" mark="underline" />
      <ToolbarToggle
        icon={Strikethrough}
        name="Strikethrough"
        mark="strikethrough"
      />

      <Separator />

      <FontSizeDropdown />

      <Separator />

      <TextAlignDropdown />
      <ListDropdown />

      <Separator />

      <ToolbarButton icon={Image} name="Insert Image" />
      <EmailTemplateInsertLinkButton />
      <ToolbarButton icon={Mail} name="Insert Email" />

      <Separator />

      <ToolbarButton icon={Paperclip} name="Attach File" />
    </div>
  );
}

function Separator() {
  return <ShadcnSeparator orientation="vertical" className="h-6! my-auto" />;
}
