import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ParagraphElement } from "@/lib/emails/types/elements/paragraph-element";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  LucideIcon,
} from "lucide-react";
import { Editor, Element, Transforms } from "slate";
import { useSlate } from "slate-react";

type Option = {
  value: "left" | "center" | "right" | "justify";
  label: string;
  icon?: LucideIcon;
};

const options: Option[] = [
  { value: "left", label: "Left", icon: AlignLeft },
  { value: "center", label: "Center", icon: AlignCenter },
  { value: "right", label: "Right", icon: AlignRight },
  { value: "justify", label: "Justify", icon: AlignJustify },
];

export default function EditorSelectAlignSelect() {
  const editor = useSlate();
  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
  });

  const alignValue = match
    ? (match[0] as ParagraphElement).align || "left"
    : "left";

  const selected =
    options.find((option) => option.value === alignValue) || null;

  function setSelected(option: string) {
    Transforms.setNodes(editor, {
      align: option as Option["value"],
    });
  }

  return (
    <Tooltip delayDuration={500}>
      <Select value={selected?.value || ""} onValueChange={setSelected}>
        <TooltipTrigger asChild>
          <SelectTrigger className="hover:bg-accent hover:border-border border-transparent transition-colors">
            <span className="sr-only">Align</span>
            {selected?.icon && <selected.icon className="text-foreground" />}
          </SelectTrigger>
        </TooltipTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.icon && <option.icon className="text-foreground" />}
              <span>{option.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <TooltipContent>Align</TooltipContent>
    </Tooltip>
  );
}
