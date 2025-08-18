import {
  useIsSlotInEditMode,
  useIsSlotReadonly,
} from "@/contexts/slot-tree-context";
import { DeserializeRegex } from "@/lib/format/serialize-regex";
import { useSubscribeSlotToEventSystem } from "@/lib/prospects/slots/hooks/use-subscribe-slot-to-event-system";
import { RenderSlotProps } from "@/lib/prospects/types/slots-utility/render-slot-props";
import type { TextFieldSlot as TextFieldSlotType } from "@/lib/prospects/types/slots/text-field-slot";
import { useEffect, useState } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

export default function TextFieldSlot({
  slot,
}: RenderSlotProps<TextFieldSlotType>) {
  const { id, name, placeholder } = slot;
  const isEditing = useIsSlotInEditMode();
  const readonly = useIsSlotReadonly();
  const [text, setText] = useState("");

  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!text) {
      setError(slot.required ? "This field is required" : "");
      return;
    }

    setError(
      DeserializeRegex(slot.formatRegex).test(text)
        ? ""
        : slot.validateFormatError,
    );
  }, [text, touched, slot]);

  useSubscribeSlotToEventSystem({
    slot,
    valueState: text,
    setState: setText,
    onReadValue: () => setTouched(true),
  });

  return (
    <div>
      <Label htmlFor={id} className="gap-1">
        <span>{name}</span>
        {slot.required && !readonly && <span>*</span>}
      </Label>

      <Input
        className="mt-2"
        type="text"
        id={id}
        placeholder={placeholder}
        disabled={isEditing}
        readOnly={readonly}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => setTouched(true)}
      />

      {touched && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
