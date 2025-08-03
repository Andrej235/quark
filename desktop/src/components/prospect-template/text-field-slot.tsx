import { RenderSlotProps } from "@/lib/prospects/slot-types/render-slot-props";
import { TextFieldSlot as TextFieldSlotType } from "@/lib/prospects/slot-types/text-field-slot";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useIsSlotInEditMode } from "@/contexts/slot-edit-context";
import { useSubscribeSlotToEventSystem } from "@/lib/prospects/use-subscribe-slot-to-event-system";
import { useState } from "react";

export default function TextFieldSlot({
  slot,
}: RenderSlotProps<TextFieldSlotType>) {
  const { name, placeholder } = slot;
  const isEditing = useIsSlotInEditMode();
  const [text, setText] = useState("");

  useSubscribeSlotToEventSystem(slot, text);

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
