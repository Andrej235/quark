import { RenderSlotProps } from "@/lib/prospect-template/render-slot-props";
import { TextFieldSlot as TextFieldSlotType } from "@/lib/prospect-template/text-field-slot";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useIsSlotInEditMode } from "@/contexts/slot-edit-context";

export default function TextFieldSlot({
  slot,
}: RenderSlotProps<TextFieldSlotType>) {
  const { name, placeholder } = slot;
  const isEditing = useIsSlotInEditMode();

  return (
    <>
      <Label htmlFor={name}>{name}</Label>
      <Input
        className="mt-2"
        type="text"
        id={name}
        placeholder={placeholder}
        disabled={isEditing}
      />
    </>
  );
}
