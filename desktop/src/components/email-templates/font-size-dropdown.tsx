import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useState } from "react";
import { buttonVariants } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function FontSizePicker() {
  const presetSizes = ["12", "14", "16", "18", "20", "24", "32"];
  const [fontSize, setFontSize] = useState<string>("16");

  return (
    <div className="flex items-center gap-2">
      <Select
        value={presetSizes.includes(fontSize) ? fontSize : ""}
        onValueChange={(val) => setFontSize(val)}
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
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="group-hover:border-border border-r-1 w-8 border-transparent transition-colors [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
