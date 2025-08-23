import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";

type EditorButtonProps = {
  icon: LucideIcon;
  name: string;
  className?: string;
  onClick?: () => void;
};

export default function EditorButton({
  icon: Icon,
  className,
  name,
  onClick,
}: EditorButtonProps) {
  return (
    <Tooltip delayDuration={500}>
      <Button
        className={className}
        asChild
        onClick={(e) => {
          e.preventDefault();
          onClick?.();
        }}
        variant="ghost"
      >
        <TooltipTrigger>
          <Icon />
          <span className="sr-only">{name}</span>
        </TooltipTrigger>
      </Button>

      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  );
}
