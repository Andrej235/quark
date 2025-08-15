import { useIsSlotInEditMode } from "@/contexts/slot-edit-context";
import { useSubscribeSlotToEventSystem } from "@/lib/prospects/slots/hooks/use-subscribe-slot-to-event-system";
import { RenderSlotProps } from "@/lib/prospects/types/slots-utility/render-slot-props";
import { TextFieldSlot as TextFieldSlotType } from "@/lib/prospects/types/slots/text-field-slot";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function TextFieldSlot({
  slot,
}: RenderSlotProps<TextFieldSlotType>) {
  const { name, placeholder } = slot;
  const isEditing = useIsSlotInEditMode();
  const [text, setText] = useState("");

  useSubscribeSlotToEventSystem(slot, text, setText);

  return (
    <div>
      <Label htmlFor={name}>{name}</Label>
      <Input
        className="mt-2"
        type="text"
        id={name}
        placeholder={placeholder}
        disabled={isEditing}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
