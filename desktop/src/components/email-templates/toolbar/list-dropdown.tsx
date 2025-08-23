import { ChevronDown, List, ListOrdered } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Toggle } from "../../ui/toggle";
import { cn } from "@/lib/cn";

export default function ListDropdown() {
  const [selected, setSelected] = useState<"ul" | "ol" | null>(null);

  return (
    <DropdownMenu>
      <div
        className={cn(
          "hover:border-border hover:bg-accent rounded-md border border-transparent pr-1 transition-colors",
          selected && "bg-accent",
        )}
      >
        <Toggle
          pressed={!!selected}
          onPressedChange={(pressed) => setSelected(pressed ? "ul" : null)}
        >
          {selected === "ol" ? <ListOrdered /> : <List />}
        </Toggle>

        <DropdownMenuTrigger>
          <ChevronDown className="text-muted-foreground size-4 opacity-50" />
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setSelected("ul")}>
          <List />
          <span>Bullet List</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setSelected("ol")}>
          <ListOrdered />
          <span>Numbered List</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
