import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useIsSlotInEditMode,
  useIsSlotReadonly,
} from "@/contexts/slot-tree-context";
import { useSubscribeSlotToEventSystem } from "@/lib/prospects/slots/hooks/use-subscribe-slot-to-event-system";
import { RenderSlotProps } from "@/lib/prospects/types/slots-utility/render-slot-props";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function RichTextFieldSlot({
  slot,
}: RenderSlotProps<"rich-text-field">) {
  const { id, name, placeholder } = slot;
  const isEditing = useIsSlotInEditMode();
  const readonly = useIsSlotReadonly();
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"edit" | "view">("edit");

  useSubscribeSlotToEventSystem({
    slot,
    valueState: text,
    setState: setText,
  });

  return (
    <div>
      <div className="flex justify-between">
        <Label htmlFor={id} className="gap-1">
          {name}
        </Label>

        <Button
          variant="outline"
          disabled={isEditing}
          onClick={() => setMode((x) => (x === "edit" ? "view" : "edit"))}
        >
          Show {mode === "edit" ? "Preview" : "Raw Text"}
        </Button>
      </div>

      {mode === "edit" ? (
        <Textarea
          className="max-h-196 mt-2 min-h-96"
          id={id}
          placeholder={placeholder}
          disabled={isEditing}
          readOnly={readonly}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <div className="prose text-foreground prose-invert">
          <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
        </div>
      )}
    </div>
  );
}
