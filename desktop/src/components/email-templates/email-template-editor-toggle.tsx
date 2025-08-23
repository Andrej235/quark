import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSlateMark } from "@/lib/emails/hooks/use-slate-mark";
import { TextMarks } from "@/lib/emails/types/text-marks";
import { LucideIcon } from "lucide-react";

type EditorButtonProps = {
  mark: TextMarks;
  icon: LucideIcon;
  name: string;
  className?: string;
};

export default function EditorToggle({
  icon: Icon,
  className,
  name,
  mark,
}: EditorButtonProps) {
  const [isOn, toggleMark] = useSlateMark(mark);

  return (
    <Tooltip delayDuration={500}>
      <Toggle
        className={className}
        asChild
        pressed={isOn}
        onPressedChange={toggleMark}
        onMouseDown={(e) => e.preventDefault()}
      >
        <TooltipTrigger>
          <Icon />
          <span className="sr-only">{name}</span>
        </TooltipTrigger>
      </Toggle>

      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  );
}
