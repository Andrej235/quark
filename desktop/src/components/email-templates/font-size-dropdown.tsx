import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Editor } from "slate";
import { useSlate } from "slate-react";
import { buttonVariants } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function FontSizePicker() {
  const editor = useSlate();

  const presetSizes = ["8", "10", "12", "14", "16", "24", "32"];
  const fontSize = (Editor.marks(editor)?.fontSize ?? 10).toString();

  function handleChange(e: string) {
    const value = e.replace(/[^\d^.]/g, "").slice(0, 4);

    Editor.addMark(editor, "fontSize", Number(value));
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={presetSizes.includes(fontSize) ? fontSize : ""}
        onValueChange={handleChange}
      >
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <div
              className={buttonVariants({
                variant: "outline",
                className:
                  "pr-0! gap-0! hover:border-border group border-transparent",
              })}
            >
              <input
                value={fontSize}
                onChange={(e) => handleChange(e.target.value)}
                className="group-hover:border-border border-r-1 w-[4ch] border-transparent outline-none transition-colors [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />

              <SelectTrigger className="w-max border-none"></SelectTrigger>
            </div>
          </TooltipTrigger>

          <TooltipContent>Font Size</TooltipContent>
        </Tooltip>

        <SelectContent>
          {presetSizes.map((size) => (
            <SelectItem key={size} value={size}>
              {size} px
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
