import {
  Bold,
  Braces,
  Image,
  Italic,
  Paperclip,
  Sparkles,
  Strikethrough,
  Underline,
} from "lucide-react";
import { Separator as ShadcnSeparator } from "../../ui/separator";
import FontSizePicker from "./font-size-picker";
import InsertEmailButton from "./insert-email-button";
import InsertLinkButton from "./insert-link-button";
import ListDropdown from "./list-dropdown";
import TextAlignDropdown from "./text-align-dropdown";
import ToolbarButton from "./toolbar-button";
import ToolbarToggle from "./toolbar-toggle";

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

      <FontSizePicker />

      <Separator />

      <TextAlignDropdown />
      <ListDropdown />

      <Separator />

      <ToolbarButton icon={Image} name="Insert Image" />
      <InsertLinkButton />
      <InsertEmailButton />

      <Separator />

      <ToolbarButton icon={Paperclip} name="Attach File" />
    </div>
  );
}

function Separator() {
  return <ShadcnSeparator orientation="vertical" className="h-6! my-auto" />;
}
