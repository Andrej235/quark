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
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

type Option = {
  value: string;
  label: string;
  icon?: LucideIcon;
};

export default function EditorSelectAlignSelect() {
  const [options] = useState(() => [
    { value: "left", label: "Left", icon: AlignLeft },
    { value: "center", label: "Center", icon: AlignCenter },
    { value: "right", label: "Right", icon: AlignRight },
    { value: "justify", label: "Justify", icon: AlignJustify },
  ]);
  const [selected, setSelected] = useState<Option | null>(null);

  useEffect(() => {
    setSelected(options[0]);
  }, [options]);

  return (
    <Tooltip delayDuration={500}>
      <Select
        value={selected?.value || ""}
        onValueChange={(value) =>
          setSelected(options.find((option) => option.value === value) || null)
        }
      >
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
