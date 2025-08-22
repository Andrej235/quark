import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

type EditorButtonProps = {
  icon: LucideIcon;
  name: string;
  className?: string;
};

export default function EditorButton({
  icon: Icon,
  className,
  name,
}: EditorButtonProps) {
  return (
    <Tooltip delayDuration={500}>
      <Toggle className={className} asChild>
        <TooltipTrigger>
          <Icon />
          <span className="sr-only">{name}</span>
        </TooltipTrigger>
      </Toggle>

      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  );
}
